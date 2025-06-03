import mongoose from 'mongoose';
import { Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;

interface ConnectType {
  db: Db;
  mongoose: typeof mongoose;
}

export async function connectToDatabase(): Promise<ConnectType> {
  if (mongoose.connection.readyState >= 1) {
    if (!mongoose.connection.db) {
      throw new Error('Database connection exists but db is not initialized');
    }
    return {
      db: mongoose.connection.db,
      mongoose: mongoose
    };
  }

  await mongoose.connect(uri);
  
  if (!mongoose.connection.db) {
    throw new Error('Failed to initialize database after connection');
  }

  return {
    db: mongoose.connection.db,
    mongoose: mongoose
  };
}
