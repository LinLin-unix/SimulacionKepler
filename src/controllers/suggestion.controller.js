const Suggestion = require('../models/Suggestion');

const suggestionCtrl = {};

suggestionCtrl.saveSuggestions = async (req, res) => {
  try {
    console.log('Solicitud recibida:', req.body);
    const { suggestions } = req.body;

    if (!suggestions || !Array.isArray(suggestions)) {
      return res.status(400).json({ message: 'No se han recibido sugerencias válidas' });
    }

    const userId = req.user.id;
    console.log('Usuario:', userId);

    const newSuggestion = new Suggestion({
      user: userId,
      suggestions,
    });

    await newSuggestion.save();
    req.flash('success', 'Sugerencias guardadas exitosamente');
    res.redirect('/');
  } catch (error) {
    console.error('Error al guardar las sugerencias:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


module.exports = suggestionCtrl;
