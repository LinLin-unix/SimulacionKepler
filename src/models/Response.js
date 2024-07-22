const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
  totalScore: { type: Number, required: true },
  timeTaken: { type: String, required: true },
  precision: { type: Number, required: true },
  comprehension: { type: Number, required: true },
  feedback: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  attempts: { type: Number, default: 1 },
  status: { type: Number, default: 1, },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Response', responseSchema);
