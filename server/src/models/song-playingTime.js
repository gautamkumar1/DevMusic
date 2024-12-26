const mongoose = require('mongoose');

const songPlayingTimeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  songPlayingTime: { type: Number, default: 0 },
  arrayOfSongPlayingTime: { type: [Number], default: [] },
  songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', default: null },
});

module.exports = mongoose.model('SongPlayingTime', songPlayingTimeSchema);