const loginCtrl = {};

const User = require('../models/User');
const passport = require('passport');

loginCtrl.renderLogin = (req, res) => {
    res.render('users/signin', {
        csrfToken: req.csrfToken()
    });
};

// Redirección del administrador
loginCtrl.signin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/users/signin');
        
        // Verificar si el usuario está activo
        if (user.status === 0) {
            req.flash('error_msg', 'Cuenta desactivada. Contacta al administrador.');
            return res.redirect('/users/signin');
        }

        req.logIn(user, (err) => {
            if (err) return next(err);

            // Lista de correos electrónicos de administradores
            const adminEmails = ['Root@cfg.cfg', 'Boot@cfg.cfg'];
            
            // Redirigir a la vista del dashboard si el usuario es un administrador
            if (adminEmails.includes(user.email)) {
                return res.redirect('/admin/dashboard');
            }
            
            // Redirigir a la página principal si es un usuario normal
            return res.redirect('/');
        });
    })(req, res, next);
};


loginCtrl.renderRegistro = (req, res) => {
    res.render('users/signup', {
        csrfToken: req.csrfToken()
    });
};

loginCtrl.signup = async (req, res) => {
    const { username, email, password, vali_password } = req.body;
    const errors = [];

    // Validación de datos del formulario
    if (!username || !email || !password || !vali_password) {
        errors.push({ text: 'Todos los campos son obligatorios' });
    }
    if (password !== vali_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe tener al menos 4 caracteres' });
    }
    if (errors.length > 0) {
        return res.render('users/signup', {
            errors,
            csrfToken: req.csrfToken(),
            username,
            email
        });
    } else {
        const emailUser = await User.findOne({ email });
        if (emailUser) {
            if (emailUser.status === 0) {
                req.flash('error_msg', 'El correo electrónico ya está en uso.');
                //req.flash('error_msg', 'Cuenta desactivada. Contacta al administrador.');
            } else {
                req.flash('error_msg', 'El correo electrónico ya está en uso.');
            }
            return res.redirect('/users/signup');
        } else {
            const newUser = new User({ username, email });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success', 'Usuario registrado correctamente.');
            res.redirect('/users/signin');
        }
    }
};


loginCtrl.logout = (req, res) => {
    req.logout(() => {
        req.flash('success', 'Has salido de la sesión.');
        res.redirect('/users/signin');
    });
};

module.exports = loginCtrl;
