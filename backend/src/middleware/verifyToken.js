import admin from '../services/firebase.js';

/**
 * Middleware function to check if a valid Firebase ID token is present in the request headers.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function to be called.
 * @returns {void} - Either calls the next middleware or responds with an error if token is missing or invalid.
 */
const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.replace('Bearer ', '');

  if (!idToken) {
    return res.status(401).json({ message: 'Error 401: Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ message: 'Error verifying token', error: error.message });
  }
};

export default verifyToken;
