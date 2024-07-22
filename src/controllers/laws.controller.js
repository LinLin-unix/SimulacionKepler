const lawCtrl = {};

lawCtrl.renderFirstLaw = (req, res) => {
    res.render('laws/FirstLaw');
}
lawCtrl.renderSecondLaw = (req, res) => {
    res.render('laws/SecondLaw');
}
lawCtrl.renderThirdtLaw = (req, res) => {
    res.render('laws/ThirdtLaw');
}


module.exports = lawCtrl;