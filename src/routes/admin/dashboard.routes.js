const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../lib/auth');

// Dashboard del Administrador
router.get('/dashboard', isAdmin, (req, res) => {
    res.render('admin/dashboard');
});

module.exports = router;
