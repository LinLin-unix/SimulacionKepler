const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const handlebars = require('handlebars');
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const methodOverride = require('method-override');
const csrfProtection = csrf({ cookie: true });
const helpers = require('../helpers/libs');

require('../lib/passport');
require('../db');

module.exports = (app) => {
  // Settings
  app.set('port', process.env.PORT || 8080);
  app.set('views', path.join(__dirname, '../views'));
  app.engine(
    '.hbs',
    engine({
      defaultLayout: 'main',
      layoutsDir: path.join(app.get('views'), 'layouts'),
      partialsDir: (path.join(app.get('views'), 'partials')),
      handlebars: allowInsecurePrototypeAccess(handlebars),
      // partialsDir: [path.join(app.get('views'), 'partials'), path.join(app.get('views'), 'modals')],
      extname: '.hbs',
      helpers: helpers,
    })
  );
  app.set('view engine', '.hbs');

  // Middlewares
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride('_method'));

  app.use(
    session({
      secret: 'Admin',
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: false, // Usar true si usas HTTPS
      }
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(csrfProtection);
 
  app.use(csrf({ cookie: true }));
  

  // Variables Globales
  app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.message = req.flash('message');
    res.locals.user = req.user || null;
    res.locals.csrfToken = req.csrfToken();
    next();
  });

  // Routes
  app.use(require('../routes/index.routes'));
  app.use(require('../routes/laws.routes'));
  app.use(require('../routes/form.routes'));
  app.use(require('../routes/login.routes'));
  app.use(require('../routes/stacs.routes'));
  app.use('/suggestions', require('../routes/suggestion.routes'));
  app.use(require('../routes/admin/users.routes'));
  app.use(require('../routes/admin/reports.routes'));
  app.use(require('../routes/admin/stats.routes'));
  app.use('/admin', require('../routes/admin/dashboard.routes'));

  // Static files
  app.use('/public', express.static(path.join(__dirname, '../public')));

  // Manejo de Errores
  app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).send('Formulario CSRF no válido');
    } else {
      console.error(err.stack);
      res.status(500).send('Error interno del servidor');
    }
  });

  // Error Handlers
  if (app.get('env') === 'development') {
    app.use(errorhandler());
  }

  return app;
};
