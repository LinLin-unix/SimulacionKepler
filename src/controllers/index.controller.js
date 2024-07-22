const indexCtrl = {};

indexCtrl.renderIndex = (rep, res) => {
    res.render('index');
}

indexCtrl.renderLaw = (rep, res) => {
    res.render('law');
}

module.exports = indexCtrl;