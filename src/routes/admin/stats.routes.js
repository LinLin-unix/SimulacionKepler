const express = require('express');
const router = express.Router();
const { 
    recentStats
 } = require('../../controllers/admin/stats.controller');

const {isLoggedIn} = require('../../lib/auth');

router.get('/admin/stats', isLoggedIn, recentStats);

module.exports = router;
