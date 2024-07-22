module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'No estás autorizado.');
        return res.redirect('/users/signin');
    },

    isAdmin(req, res, next) {
        const adminEmails = ['Root@cfg.cfg', 'Boot@cfg.cfg'];
        if (req.isAuthenticated() && adminEmails.includes(req.user.email)) {
            return next();
        }
        req.flash('error_msg', 'No tienes permisos de administrador.');
        return res.redirect('/');
    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    }
};