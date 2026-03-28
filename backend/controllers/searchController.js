const { getDB } = require('../config/db');

exports.getAutocomplete = async (req, res) => {
  try {
    const keyword = req.query.q;
    if (!keyword) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const collection = getDB().collection('movies');

    const pipeline = [
      {
        $search: {
          index: 'unified_index',
          autocomplete: {
            query: keyword, score: { boost: { value: 5 } },
            path: 'title'
          }
        }
      },
      {
        $limit: 10
      }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    res.json(results || []);
  } catch (err) {
    console.error("Autocomplete Error Detail:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSearch = async (req, res) => {
  try {
    const keyword = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const collection = getDB().collection('movies');

    if (!keyword) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const pipelineMatch = [
      {
        $search: {
          index: 'unified_index',
          text: {
            query: keyword, score: { boost: { value: 5 } },
            path: ['title', 'plot', 'genres', 'fullplot', 'cast', 'directors'],
            fuzzy: {}
          }
        }
      }
    ];
    
    const matchStage = {};
    if (req.query.year) matchStage.year = parseInt(req.query.year);
    if (req.query.genre) matchStage.genres = req.query.genre;
    if (req.query.rating) matchStage['imdb.rating'] = { $gte: parseFloat(req.query.rating) };
    
    if (Object.keys(matchStage).length > 0) {
      pipelineMatch.push({ $match: matchStage });
    }

    const pipeline = [
      ...pipelineMatch,
      {
        $facet: {
          metadata: [ { $count: 'total' } ],
          data: [
            { $skip: skip },
            { $limit: limit },
            {
               $addFields: {
                 score: { $meta: 'searchScore' }
               }
            }
          ]
        }
      }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    
    // SAFE PARSING
    const root = results && results[0] ? results[0] : {};
    const data = root.data || [];
    const total = (root.metadata && root.metadata[0]) ? root.metadata[0].total : 0;

    res.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    });
  } catch (err) {
    console.error("Search Error Detail:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
