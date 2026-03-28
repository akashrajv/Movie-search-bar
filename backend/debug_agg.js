require('dotenv').config();
const { MongoClient } = require('mongodb');

async function debugSearch() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    console.log("Connected...");
    const db = client.db(process.env.DB_NAME || 'sample_mflix');
    const collection = db.collection('movies');

    const keyword = 'Godfather';
    const pipeline = [
      {
        $search: {
          index: 'unified_index',
          text: {
            query: keyword,
            path: ['title', 'plot', 'genres', 'fullplot', 'cast', 'directors'],
            fuzzy: {
              maxEdits: 2,
              prefixLength: 0
            }
          }
        }
      },
      {
        $limit: 1
      }
    ];

    console.log("Running aggregation...");
    const results = await collection.aggregate(pipeline).toArray();
    console.log("Results found:", results.length);
    if (results.length > 0) console.log("First result title:", results[0].title);
  } catch (err) {
    console.error("!!! AGGREGATION ERROR !!!");
    console.error(err);
  } finally {
    await client.close();
  }
}

debugSearch();
