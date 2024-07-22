const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const Response = require('./Response');
const Suggestion = require('./Suggestion');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Middleware para eliminar respuestas y sugerencias cuando se elimina un usuario
UserSchema.pre('remove', async function(next) {
  try {
    // Actualizar el estado y la fecha de actualización en respuestas relacionadas al usuario
    await Response.updateMany({ user: this._id }, { $set: { status: 0, updatedAt: new Date() } });

    // Actualizar el estado y la fecha de actualización en sugerencias relacionadas al usuario
    await Suggestion.updateMany({ user: this._id }, { $set: { status: 0, updatedAt: new Date() } });

    next();
  } catch (error) {
    next(error);
  }
});

// Método para encriptar la contraseña
UserSchema.methods.encryptPassword = async function(password) {
  const salt = await bcrypt.genSalt(11);
  return await bcrypt.hash(password, salt);
};

// Método para comparar la contraseña ingresada con la almacenada
UserSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
