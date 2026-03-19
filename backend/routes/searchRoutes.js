const express = require('express');
const router = express.Router();
const { getAutocomplete, getSearch } = require('../controllers/searchController');

router.get('/autocomplete', getAutocomplete);
router.get('/search', getSearch);

module.exports = router;
