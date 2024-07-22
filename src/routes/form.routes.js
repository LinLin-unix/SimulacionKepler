const express = require('express');
const router = express.Router();

const { 
    renderLawsForm,
    createAnswerForm
}=require('../controllers/form.controller');

const {isLoggedIn} = require('../lib/auth');


/**************** FORM - LAWS ***********************/
router.get('/laws/FormLaws', isLoggedIn, renderLawsForm);
router.post('/calcification-form', isLoggedIn, createAnswerForm);

module.exports = router;