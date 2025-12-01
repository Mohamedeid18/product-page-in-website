import { connect } from 'mongoose';

const connectDB = async (uri) => {
  if (!uri) throw new Error('MONGO_URI not provided');
  await connect(uri, { 
  });
  console.log('MongoDB connected');
};

export default connectDB;

