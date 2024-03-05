// db.ts

import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '', {

    });
    console.log('MongoDB Connected');
  } catch (error: any) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
}
