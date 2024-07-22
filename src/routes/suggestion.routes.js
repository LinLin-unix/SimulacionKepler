const express = require('express');
const router = express.Router();

const suggestionCtrl = require('../controllers/suggestion.controller');

const {isLoggedIn} = require('../lib/auth');

// POST - Guardar sugerencias
router.post('/save', isLoggedIn, suggestionCtrl.saveSuggestions);

module.exports = router;
