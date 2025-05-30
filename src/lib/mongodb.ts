import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    
    // Test the connection
    await client.db().command({ ping: 1 });
    
    const db = client.db('photographydb');
    console.log('Successfully connected to MongoDB database: photographydb');
    
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Attempt to reconnect
    try {
      console.log('Attempting to reconnect...');
      await client.close();
      client = new MongoClient(uri, options);
      const newClient = await client.connect();
      const db = newClient.db('photographydb');
      console.log('Reconnection successful');
      return { client: newClient, db };
    } catch (reconnectError) {
      console.error('Reconnection failed:', reconnectError);
      throw new Error('Failed to connect to database after retry');
    }
  }
}
