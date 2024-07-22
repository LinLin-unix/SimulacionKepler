const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, req.flash('message', 'Usuario no encontrado'));
    }

    // Verificar si el usuario está activo
    if (user.status === 0) {
      return done(null, false, req.flash('message', 'Cuenta desactivada. Contacta al administrador.'));
    }

    const isValid = await user.matchPassword(password);
    if (isValid) {
      return done(null, user, req.flash('success', 'Bienvenido ' + user.username));
    } else {
      return done(null, false, req.flash('message', 'Contraseña incorrecta'));
    }
  } catch (err) {
    return done(err);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
