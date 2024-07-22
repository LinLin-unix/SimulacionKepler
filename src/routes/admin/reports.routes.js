const express = require('express');
const router = express.Router();
const reportsCtrl = require('../../controllers/admin/reports.controller');
const { isLoggedIn } = require('../../lib/auth');

// Rutas para el reporte de notas
router.get('/admin/reports/scores', isLoggedIn, reportsCtrl.renderScoreReport);
router.post('/admin/reports/scores/filter', isLoggedIn, reportsCtrl.filterByBestScore);

// Rutas para el reporte de usuarios registrados
router.get('/admin/reports/users', isLoggedIn, reportsCtrl.usersReport);

// Ruta para obtener el reporte de notas
router.get('/admin/reports/scores/stats', isLoggedIn, reportsCtrl.scoresReport);

// Ruta para obtener el reporte sugerencias
router.get('/admin/reports/suggs', isLoggedIn, reportsCtrl.renderSuggs);

// Ruta para obtener el reporte users eliminados
router.get('/admin/reports/remove', isLoggedIn, reportsCtrl.renderUserRemove);

module.exports = router;
