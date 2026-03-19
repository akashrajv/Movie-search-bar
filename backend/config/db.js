const { MongoClient } = require('mongodb');

let db = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not set");
    
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(process.env.DB_NAME || 'sample_mflix');
    console.log('MongoDB connection established');
    return db;
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

module.exports = { connectDB, getDB };
