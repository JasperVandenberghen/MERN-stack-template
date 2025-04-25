import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConfig = cloudinary.config({ 
  url: process.env.CLOUDINARY_URL,
});

// The upload stream function for uploading images
export const uploadImageStream = (stream, options = {}) => {
  return new Promise((resolve, reject) => {
    const streamUpload = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        console.log('Upload to Cloudinary failed');
        reject(error);
      }
    });
    stream.pipe(streamUpload);
  });
};

export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'not found') {
      return { message: 'Image not found, nothing to delete.' };
    }
    return result;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};


// // upload: Use this if you have the file URL or file path.
// export const uploadResult = await cloudinary.uploader
//   .upload('https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//       public_id: 'shoes',
//   })
//   .catch((error) => {
//       console.log(error);
//   });


// // Optimize delivery by resizing and applying auto-format and auto-quality
// export const optimizeUrl = cloudinary.url('shoes', {
//     fetch_format: 'auto',
//     quality: 'auto',
// });


// // Transform the image: auto-crop to square aspect_ratio
// export const autoCropUrl = cloudinary.url('shoes', {
//     crop: 'auto',
//     gravity: 'auto',
//     width: 500,
//     height: 500,
// });


