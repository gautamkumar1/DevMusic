const mongoose = require('mongoose');

const SingingActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // ISO format: YYYY-MM-DD
  count: { type: Number, default: 0 },
  songPlayingTime: { type: Number, default: 0 },
  arrayOfSongPlayingTime: { type: [Number], default: [] },
  songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', default: null },
});

const SingingActivity = mongoose.model('SingingActivity', SingingActivitySchema);

module.exports = SingingActivity;
