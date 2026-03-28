const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkData() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const dbName = process.env.DB_NAME || 'sample_mflix';
    const db = client.db(dbName);
    console.log(`Checking database: ${dbName}`);
    
    const movie = await db.collection('movies').findOne({});
    console.log('Sample Movie Data:', JSON.stringify(movie, null, 2));
    
    const count = await db.collection('movies').countDocuments();
    console.log('Total Movies in collection:', count);
  } catch (err) {
    console.error('Error checking data:', err);
  } finally {
    await client.close();
  }
}
checkData();
