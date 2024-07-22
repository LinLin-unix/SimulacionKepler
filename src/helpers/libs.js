const helpers = {};

// Helper para convertir objetos a JSON
helpers.json = (context) => {
  return JSON.stringify(context);
};

// Helper para formatear fechas
helpers.formatDate = (date, format) => {
  const moment = require('moment');
  return moment(date).format(format);
};

// Helper para condiciones en Handlebars
helpers.ifCond = function (v1, operator, v2, options) {
    if (!options) {
      console.error('El helper ifCond requiere opciones con propiedades "fn" e "inverse"');
      return '';
    }
  
    switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
  };

// Helper para crear un rango de números
helpers.range = (from, to, context) => {
    let result = '';
    for (let i = from; i <= to; i++) {
      result += context.fn(i);
    }
    return result;
  };

module.exports = helpers;
