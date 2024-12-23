const mongoose = require('mongoose');

const SingingActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // ISO format: YYYY-MM-DD
  count: { type: Number, default: 0 }
});

const SingingActivity = mongoose.model('SingingActivity', SingingActivitySchema);

module.exports = SingingActivity;
