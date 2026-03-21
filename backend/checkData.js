const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkData() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db('moviedb');
    const movie = await db.collection('movies').findOne({ title: 'Jai Bhim' });
    console.log('Jai Bhim Data:', JSON.stringify(movie, null, 2));
    const count = await db.collection('movies').countDocuments();
    console.log('Total Movies:', count);
  } finally {
    await client.close();
  }
}
checkData();
