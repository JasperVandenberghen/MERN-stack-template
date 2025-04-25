import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

const clientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

const connectDB = async () => {
  try {
    await mongoose.connect(uri, clientOptions);
    if (process.env.NODE_ENV !== 'test') {
      console.log('Connected to MongoDB Atlas successfully!');
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error connecting to MongoDB Atlas:', error);
    }
    process.exit(1);
  }
};

export default connectDB;
