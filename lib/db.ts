'use server';

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: Cached | undefined;
}

const cached: Cached = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      heartbeatFrequencyMS: 1000, // Check server status every second
      retryWrites: true,
      retryReads: true,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error details:', {
          code: error.code,
          codeName: error.codeName,
          name: error.name,
          message: error.message,
          // Log the first part of the connection string (hiding credentials)
          uri: MONGODB_URI.split('@')[1] || 'hidden',
        });
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
