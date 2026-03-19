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
          index: 'autocomplete_title',
          autocomplete: {
            query: keyword,
            path: 'title',
            fuzzy: {
              maxEdits: 1,
              prefixLength: 1,
              maxExpansions: 256
            }
          }
        }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 1,
          title: 1,
          year: 1,
          poster: 1
        }
      }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    res.json(results);
  } catch (err) {
    console.error(err);
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
          index: 'fuzzy_search',
          text: {
            query: keyword,
            path: ['title', 'plot', 'genres', 'fullplot', 'cast', 'directors'],
            fuzzy: {
              maxEdits: 2,
              prefixLength: 0,
              maxExpansions: 256
            }
          }
        }
      }
    ];
    
    // Support basic filters
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
               $project: {
                 _id: 1,
                 title: 1,
                 year: 1,
                 poster: 1,
                 plot: 1,
                 fullplot: 1,
                 imdb: 1,
                 genres: 1,
                 cast: 1,
                 directors: 1,
                 score: { $meta: 'searchScore' }
               }
            }
          ]
        }
      }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    const data = results[0]?.data || [];
    const total = results[0]?.metadata[0]?.total || 0;

    res.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
