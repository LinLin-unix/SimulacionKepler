const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SuggestionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  suggestions: [{type: String,required: true }],
  createdAt: {type: Date, default: Date.now },
  status: {type: Number, default: 1, },
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);
