const express = require('express');
const router = express.Router();
const {
    renderLogin,
    renderRegistro,
    signin,
    signup,
    logout
} = require('../controllers/login.controller');
const { isLoggedIn } = require('../lib/auth');


/**************** LOGIN ***********************/

// LOGIN
router.get('/users/signin', renderLogin);
router.post('/users/signin', signin);

// SIGNUP
router.get('/users/signup', renderRegistro);
router.post('/users/signup', signup);

// LOGOUT
router.get('/users/logout', isLoggedIn, logout);

module.exports = router;
