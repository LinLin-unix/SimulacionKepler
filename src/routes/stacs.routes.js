const express = require('express');
const router = express.Router();

const { renderSearch,
    searchUserStats,
    renderBestScores,
    renderGlobalScores,
    renderPeaks
} = require('../controllers/stacs.controller');

const {isLoggedIn} = require('../lib/auth');

/**************** LOGIN ***********************/

//LOGIN
router.get('/stacs/Search', isLoggedIn, renderSearch);
router.post('/stacs/search', isLoggedIn, searchUserStats);
router.get('/stacs/BestScores', isLoggedIn, renderBestScores);
router.get('/stacs/GlobalScores', isLoggedIn, renderGlobalScores);
router.get('/stacs/Peaks', isLoggedIn, renderPeaks);

module.exports = router;