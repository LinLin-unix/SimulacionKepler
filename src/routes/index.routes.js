const express = require('express');
const router = express.Router();

const { renderIndex } = require('../controllers/index.controller')

const {isLoggedIn} = require('../lib/auth');

router.get('/', isLoggedIn, renderIndex)

module.exports = router;
