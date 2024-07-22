const User = require('../../models/User');
const Response = require('../../models/Response');
const Suggestion = require('../../models/Suggestion');
const moment = require('moment');

const reportsCtrl = {};

// Renderiza la página del reporte de notas
reportsCtrl.renderScoreReport = (req, res) => {
  res.render('admin/reports/scores', { csrfToken: req.csrfToken(), scores: [], selectedScore: null });
};

// Procesa la búsqueda por la mejor nota de cada usuario
reportsCtrl.filterByBestScore = async (req, res) => {
  const { score } = req.body;

  try {
    const users = await User.find({}).lean();
    let filteredScores = [];

    for (const user of users) {
      const bestResponse = await Response.findOne({ user: user._id, status: 1 }).sort({ totalScore: -1 }).lean();

      if (bestResponse && bestResponse.totalScore == score) {
        filteredScores.push({ username: user.username, email: user.email, maxScore: bestResponse.totalScore });
      }
    }

    res.render('admin/reports/scores', { csrfToken: req.csrfToken(), scores: filteredScores, selectedScore: score });
  } catch (error) {
    console.error("Error al filtrar por la mejor nota de cada usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Reporte de usuarios registrados por mes
reportsCtrl.usersReport = async (req, res) => {
  const usersByMonth = await User.aggregate([
    { $match: { status: 1 } },
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  res.render('admin/reports/users', { usersByMonth });
};

// Reporte de notas
reportsCtrl.scoresReport = async (req, res) => {
  try {
    const scores = await Response.aggregate([
      { $match: { status: 1 } },
      { $group: { _id: null, maxScore: { $max: "$totalScore" }, minScore: { $min: "$totalScore" }, avgScore: { $avg: "$totalScore" } } }
    ]);

    const scoresData = scores.length > 0 ? scores[0] : { maxScore: 0, minScore: 0, avgScore: 0 };

    res.render('admin/reports/scores', { scores: scoresData });
  } catch (err) {
    console.error('Error al obtener el reporte de notas:', err);
    res.status(500).send('Error al obtener el reporte de notas');
  }
};

// Renderiza la página de reporte de sugerencias
reportsCtrl.renderSuggs = async (req, res) => {
    try {
      // Aquí va la lógica para obtener y preparar los datos del gráfico de pastel
      const activeSuggestions = await Suggestion.find({ status: 1 }).lean();
  
      const suggestionCounts = {};
      activeSuggestions.forEach(suggestion => {
        suggestion.suggestions.forEach(sugg => {
          if (suggestionCounts[sugg]) {
            suggestionCounts[sugg]++;
          } else {
            suggestionCounts[sugg] = 1;
          }
        });
      });
  
      const labels = Object.keys(suggestionCounts);
      const data = Object.values(suggestionCounts);
  
      // Renderizar la vista con los datos del gráfico de pastel
      res.render('admin/reports/suggs', { labels, data });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener las sugerencias');
    }
};

reportsCtrl.renderUserRemove = async (req, res) => {
  try {
    // Obtener todos los usuarios eliminados (status = 0) y popular el campo deletedBy
    const removedUsers = await User.find({ status: 0 }).populate('deletedBy').lean();

    // Preparar datos para la vista
    const userData = removedUsers.map(user => {
      return {
        adminName: user.deletedBy ? user.deletedBy.username : 'Desconocido',
        adminEmail: user.deletedBy ? user.deletedBy.email : 'Desconocido',
        userName: user.username,
        userEmail: user.email,
        removedAt: moment(user.updatedAt).format('DD-MM-YYYY HH:mm')
      };
    });

    // Renderizar la vista con los datos de los usuarios eliminados
    res.render('admin/reports/remove', { userData });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el reporte de usuarios eliminados');
  }
};


module.exports = reportsCtrl;
