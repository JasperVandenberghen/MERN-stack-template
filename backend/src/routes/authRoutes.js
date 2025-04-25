import User from '../models/User.js';
import admin from '../services/firebase.js';
import express from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import rateLimit from 'express-rate-limit';
import { uploadImageStream } from '../services/cloudinary.js';
import { deleteImage } from '../services/cloudinary.js';
import { sendEmail } from '../services/sendGrid.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();
const upload = multer(); 

/**
 * Creates a new user instance with the provided Firebase UID, email, and display name.
 *
 * @param {Object} newUser - The new user object.
 * @param {string} newUser.firebaseUID - The UID from Firebase for the user.
 * @param {string} newUser.email - The email address of the user.
 * @param {string} newUser.displayName - The display name of the user, derived from the email address.
 */
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    const newUser = new User({
      firebaseUID: userRecord.uid,
      email,
      displayName: name,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: userRecord,
    });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('Attempting to email user with info');
      // send email to user with info sendGrid TODO: change this to an actual domain email when registered
      await sendEmail(
        email,
        'Registration failed',
        'If you already registered through Google, use the Google sign-in option.',
      );
    }
 
    if (error.code) {
      console.log('Error code:', error.code);
      return res.status(400).json({
        error: error.code,
        message: error.message,
      });
    }


    res.status(500).json({
      message: 'Error creating user',
      error: error.message,
    });
  }
});


/**
 * Authenticates a user with an ID token obtained from Firebase.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.headers.authorization - The ID token from Firebase, prefixed with 'Bearer '.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 *                            The response contains a JSON object with the user data and the ID token.
 * @throws {Error} - Throws an error if the request fails.
 */
router.post('/login', verifyToken, async (req, res) => {
  const decodedToken = req.user;  // This is populated by verifyToken middleware

  try {
    let user = await User.findOne({ firebaseUID: decodedToken.uid });
    
    if (!user) {
      user = new User({
        firebaseUID: decodedToken.uid,
        email: decodedToken.email,  
      });
      await user.save();
    }

    res.status(200).json({
      message: 'Login successful',
      user,
      token: req.headers.authorization,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

/**
 * Rate limiter middleware for resetting passwords.
 * Limits the number of requests to 1 per 5 minutes from the same IP address.
 *
 * @constant
 * @type {Object}
 * @property {number} windowMs - Time window in milliseconds (5 minutes).
 * @property {number} max - Maximum number of requests allowed within the time window.
 * @property {Object} message - Response message sent when the rate limit is exceeded.
 * @property {Function} keyGenerator - Function to generate a unique key for each request (uses IP address).
 */
const resetPasswordLimiter = rateLimit({
  windowMs: 60 * 5000,
  max: 1,
  message: { error: 'Too many requests, please try again later' },
  keyGenerator: (req) => req.ip,
});

router.post('/change-password', verifyToken, async (req, res) => {
  const { newPassword } = req.body;
  const decodedToken = req.user;  // This is populated by verifyToken middleware

  try {
    // Update the user's password in Firebase
    await admin.auth().updateUser(decodedToken.uid, { password: newPassword });

    res.status(200).send('Password updated successfully.');
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).send('Error changing password.');
  }
});

/**
 * Handles password reset requests for users.
 * 
 * This function processes POST requests to initiate a password reset. It checks for a valid email,
 * generates a password reset link, and sends it to the user's email. The function uses rate limiting
 * to prevent abuse.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.email - The email address of the user requesting a password reset.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 *                            Returns a 200 status with a generic message for security reasons,
 *                            or a 400 status if the email is missing, or a 500 status on error.
 */
router.post('/reset-password', resetPasswordLimiter, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  res.status(200).json({
    message: 'If this email exists in our system, a password reset link will be sent to it shortly.',
  });

  try {
    const link = await admin.auth().generatePasswordResetLink(email);

    const msg = {
      email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click or copy the link below to reset your password:\n\n${link}`,
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${link}">${link}</a></p>`,
    };

    // TODO: fix: only rate limit on successful requests
    await sendEmail(msg.email, msg.subject, msg.text, msg.html);
    // console.log(`Password reset link for ${email} generated successfully.`);
  } catch (error) {
    console.error(`Error generating password reset link for ${email}:`, error);
    res.status(500).json({ error: 'Error generating password reset link' });
  }
});

/**
 * Deletes a user's account.
 * 
 * This route handler deletes the user's account both from Firebase and the database.
 * It also deletes the user's profile picture from Cloudinary if it exists.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.headers - Request headers containing the Bearer token.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
router.delete('/delete-account', verifyToken, async (req, res) => {
  const decodedToken = req.user;  // This is populated by verifyToken middleware
  const firebaseUID = decodedToken.uid;

  try {
    const user = await User.findOne({ firebaseUID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user's profile picture from Cloudinary if it exists
    if (user.profilePicture) {
      const publicId = user.profilePicture.split('/').pop().split('.')[0];  // Extract publicId from URL
      await deleteImage(publicId); 
    }

    // Delete the user from Firebase and MongoDB
    await admin.auth().deleteUser(firebaseUID);
    await User.deleteOne({ firebaseUID });

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
});


/**
 * Retrieves the user profile information.
 * 
 * This route handler responds with the user's profile data stored in the request object.
 * If successful, it returns a 200 status code with the user profile. In case of an error,
 * it returns a 500 status code with an error message.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.user - The user object attached to the request, typically by authentication middleware.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    res.status(200).json({
      message: 'User profile fetched successfully',
      user: req.user, // The user info is attached by the verifyToken middleware
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

/**
 * Updates a user's profile information.
 *
 * This route handler handles PUT requests to update a user's profile. It accepts the user's name and an optional profile picture.
 * If a profile picture is provided, it is uploaded to Cloudinary and the old profile picture (if any) is deleted.
 * The updated user data is then saved to the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing the user's name and optional profile picture.
 * @param {string} req.body.name - The user's new display name.
 * @param {Object} req.file - The uploaded profile picture, if provided.
 * @param {Object} req.user - The user object attached to the request, typically by authentication middleware.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 *                            Responds with a 200 status code and the updated user profile if successful.
 *                            Responds with a 404 status code if the user is not found.
 *                            Responds with a 500 status code if an error occurs during the update process.
 */
router.put('/profile', verifyToken, upload.single('profilePicture'), async (req, res) => {
  const { displayName } = req.body;
  const decodedToken = req.user;  // This is populated by verifyToken middleware

  try {
    const user = await User.findOne({ firebaseUID: decodedToken.uid });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (displayName) user.displayName = displayName;
    

    // If a profile picture was uploaded, handle the image upload to Cloudinary
    if (req.file) {
      // Delete the previous profile picture if there was one
      if (user.profilePicture) {
        const publicId = user.profilePicture.split('/').pop().split('.')[0];  // Extract publicId from URL
        await deleteImage(publicId); 
      }

      // Upload the new image
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);  // Push the file buffer into the stream
      bufferStream.push(null);  // Signal that no more data will be pushed
      const cloudinaryResult = await uploadImageStream(
        bufferStream, {
          resource_type: 'image',
          public_id: `user_${user.firebaseUID}_profile_picture`,
          tags: ['profile_picture', 'avatar', `user_${user.firebaseUID}`],
      });
      
      // Save the new image URL to the user document
      user.profilePicture = cloudinaryResult.secure_url;
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});



export default router;
