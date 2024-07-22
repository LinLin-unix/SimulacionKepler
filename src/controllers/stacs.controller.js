const Response = require("../models/Response");
const User = require('../models/User');

const stacsCtrl = {};

stacsCtrl.renderSearch = (req, res) => {
  res.render("stacs/Search", { csrfToken: req.csrfToken(), bestScores: [], username: '' });
};

// Procesa la búsqueda del usuario
stacsCtrl.searchUserStats = async (req, res) => {
  const { username } = req.body;
  try {
    const users = await User.find({ username: new RegExp(username, 'i') });
    let bestScores = [];

    for (const user of users) {
      const responses = await Response.find({ user: user._id, status: 1 }).lean(); // Filtrar por estado 1
      if (responses.length) {
        const bestScore = responses.reduce((max, response) => (response.totalScore > max.totalScore ? response : max));
        bestScore.attempts = responses.length;
        bestScores.push({ user: user.username, bestScore });
      }
    }

    if (bestScores.length === 0) {
      res.render("stacs/Search", { csrfToken: req.csrfToken(), bestScores: [], username });
    } else {
      res.render("stacs/Search", { csrfToken: req.csrfToken(), bestScores, username });
    }
  } catch (error) {
    console.error("Error al buscar las estadísticas del usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};



stacsCtrl.renderBestScores = async (req, res) => {
  try {
    const responses = await Response.find({ user: req.user.id, status: 1 }).lean(); // Filtrar por estado 1
    res.render("stacs/BestScores", { responses });
  } catch (error) {
    console.error("Error obteniendo los datos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


stacsCtrl.renderGlobalScores = async (req, res) => {
  try {
    const users = await User.find({ status: 1 }).lean(); // Filtrar por usuarios activos
    const bestScores = await Promise.all(users.map(async (user) => {
      let bestScore = await Response.findOne({ user: user._id, status: 1 }).sort({ totalScore: -1 }).lean(); // Filtrar por estado 1
      if (bestScore) {
        bestScore.attempts = await Response.countDocuments({ user: user._id, status: 1 }); // Contar solo respuestas con estado 1
      } else {
        bestScore = { attempts: 0 };
      }
      return { user, bestScore };
    }));

    res.render('stacs/GlobalScores', { bestScores });

  } catch (error) {
    console.error('Error obteniendo los puntajes globales:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};



stacsCtrl.renderPeaks = async (req, res) => {
  try {
    const perfectResponses = await Response.find({ totalScore: 20, status: 1 }).lean(); // Filtrar por estado 1

    const userBestResponse = {};

    for (const response of perfectResponses) {
      const userId = response.user;
      const user = await User.findById(userId).lean();
      const timeInSeconds = convertTimeToSeconds(response.timeTaken);
      const numAttempts = await Response.countDocuments({ user: userId, status: 1 }); // Contar solo respuestas con estado 1

      if (!userBestResponse[userId] ||
          timeInSeconds < userBestResponse[userId].timeTakenInSeconds ||
          (timeInSeconds === userBestResponse[userId].timeTakenInSeconds && numAttempts < userBestResponse[userId].attempts)) {
        userBestResponse[userId] = {
          ...response,
          user: user.username,
          attempts: numAttempts,
          timeTakenInSeconds: timeInSeconds
        };
      }
    }

    const peakScores = Object.values(userBestResponse);
    peakScores.sort((a, b) => {
      if (a.timeTakenInSeconds !== b.timeTakenInSeconds) {
        return a.timeTakenInSeconds - b.timeTakenInSeconds;
      } else {
        return a.attempts - b.attempts;
      }
    });

    res.render('stacs/Peaks', { peakScores });
  } catch (error) {
    console.error('Error obteniendo los puntajes perfectos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


// Función para convertir el tiempo tomado de "mm:ss" a segundos
const convertTimeToSeconds = (timeString) => {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
};




module.exports = stacsCtrl;
