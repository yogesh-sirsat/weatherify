import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_NAME;

let cachedClient = null;

export async function connectToDatabase() {
  console.log('connecting to database...');
  if (cachedClient) {
    console.log('using cached connection');
    return { db: cachedClient.db(dbName), client: cachedClient };
  }

  if (!uri) {
    console.error('Please add your Mongo URI to .env.local');
    throw new Error('Please add your Mongo URI to .env.local');
  }

  if (!dbName) {
    console.error('Please add your Mongo database name to .env.local');
    throw new Error('Please add your Mongo database name to .env.local');
  }

  try {
    console.log('trying to connect...');
    const client = await MongoClient.connect(uri, {});

    cachedClient = client;
    console.log('connected to database');
    return { db: client.db(dbName), client };

  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
}
