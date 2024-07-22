const express = require('express');
const router = express.Router();

const { renderFirstLaw, 
    renderSecondLaw, 
    renderThirdtLaw,
    renderLaws 
} = require('../controllers/laws.controller');

const { isLoggedIn } = require('../lib/auth');

/**************** LAWS ***********************/

//FIRST LAW
router.get('/laws/FirstLaw', isLoggedIn, renderFirstLaw);

//Second LAW
router.get('/laws/SecondLaw', isLoggedIn, renderSecondLaw);

//Third LAW
router.get('/laws/ThirdtLaw', isLoggedIn, renderThirdtLaw);


module.exports = router;
