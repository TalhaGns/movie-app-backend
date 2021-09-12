var express = require('express');
var router = express.Router();
 
const watchlistControllers = require('../controllers/watchlist.controllers');

router.get('/watchlist', watchlistControllers.getAll);
router.get('/watchlist/:id', watchlistControllers.getSingleWatchlist);
router.get('/watchlist/user/:id', watchlistControllers.getWatchlistByUserId);
router.post('/watchlist', watchlistControllers.create);
router.post('/watchlist/filter', watchlistControllers.getWithQuery);
router.put('/watchlist/:id', watchlistControllers.updateWatchlist);
router.delete('/watchlist/:id', watchlistControllers.removeSingleWatchlist);

module.exports = router;         