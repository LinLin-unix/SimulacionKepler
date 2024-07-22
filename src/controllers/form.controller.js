const Response = require('../models/Response');

const formCtrl = {};

// Método para renderizar el formulario de leyes
formCtrl.renderLawsForm = (req, res) => {
  res.render('laws/FormLaws', {
    csrfToken: req.csrfToken()
  });
};

// Método para manejar la creación del formulario y la evaluación de la respuesta
formCtrl.createAnswerForm = async (req, res) => {
  try {
    const { startTime, finishTime, ...answers } = req.body;

    // Validar el formato del tiempo
    const start = new Date(startTime).getTime();
    const finish = new Date(finishTime).getTime();
    if (isNaN(start) || isNaN(finish)) {
      throw new Error('Formato de tiempo inválido');
    }

    // Calcular tiempo utilizado
    const elapsedTime = Math.min(finish - start, 10 * 60 * 1000);
    const minutesUsed = Math.floor(elapsedTime / 60000);
    const secondsUsed = Math.floor((elapsedTime % 60000) / 1000);
    const timeUsedFormatted = `${minutesUsed}:${secondsUsed < 10 ? '0' : ''}${secondsUsed}`;

    // Calcular puntuación total y feedback
    const { totalScore, feedback, precisionFormatted, comprehensionFormatted } = calculateScores(answers);

    // Guardar resultados del cuestionario en la base de datos
    await saveResponseData(
      req.user.id,
      totalScore,
      timeUsedFormatted,
      precisionFormatted,
      comprehensionFormatted,
      feedback
    );

    // Incrementar el contador de intentos en la base de datos
    await incrementAttempts(req.user.id);

    // Renderizar la vista de evaluación con los resultados
    res.render('stacs/Evaluation', {
      totalScore,
      timeTaken: timeUsedFormatted,
      feedback,
      precision: precisionFormatted,
      comprehension: comprehensionFormatted
    });
  } catch (error) {
    res.status(400).send('Error en la evaluación del formulario: ' + error.message);
  }
};

// Método para calcular la puntuación
const calculateScores = (answers) => {
  const correctConceptualAnswers = [
    { id: "question1", answer: "V1" },
    { id: "question2", answer: "V2" },
    { id: "question4", answer: "V4" }
  ];
  const correctQuantitativeAnswers = [
    { id: "question3", answer: "V3" },
    { id: "question5", answer: "V5" },
    { id: "question6", answer: "V6" },
    { id: "question7", answer: "V7" },
    { id: "question8", answer: "V8" },
    { id: "question9", answer: "V9" },
    { id: "question10", answer: "V10" }
  ];

  const numCorrectConceptual = correctConceptualAnswers.filter(item => answers[item.id] === item.answer).length;
  const numCorrectQuantitative = correctQuantitativeAnswers.filter(item => answers[item.id] === item.answer).length;

  const totalConceptualQuestions = correctConceptualAnswers.length;
  const totalQuantitativeQuestions = correctQuantitativeAnswers.length;

  const precision = totalQuantitativeQuestions === 0 ? 0 : (numCorrectQuantitative / totalQuantitativeQuestions) * 100;
  const comprehension = totalConceptualQuestions === 0 ? 0 : (numCorrectConceptual / totalConceptualQuestions) * 100;

  const precisionFormatted = precision.toFixed(2);
  const comprehensionFormatted = comprehension.toFixed(2);

  const totalScore = ((numCorrectConceptual + numCorrectQuantitative) / (totalConceptualQuestions + totalQuantitativeQuestions)) * 20;

  const feedback = totalScore < 14 ? 'Sigue aprendiendo' : totalScore <= 16 ? 'Bueno' : totalScore <= 18 ? 'Muy bien' : 'Excelente';

  return { totalScore, feedback, precision, comprehension, precisionFormatted, comprehensionFormatted };
};

// Método para guardar los resultados del cuestionario en la base de datos
const saveResponseData = async (userId, totalScore, timeTaken, precision, comprehension, feedback) => {
  const newResponse = new Response({
    user: userId,
    totalScore,
    timeTaken,
    precision,
    comprehension,
    feedback,
    attempts: 0
  });

  await newResponse.save();
};

// Método para incrementar el contador de intentos en la base de datos
const incrementAttempts = async (userId) => {
  await Response.updateOne({ user: userId }, { $inc: { attempts: 1 } });
};

module.exports = formCtrl;
