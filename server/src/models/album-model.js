const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		artist: { type: String, required: true },
		imageUrl: { type: String, required: true },
		releaseYear: { type: Number,},
		songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
	},
	{ timestamps: true }
); 

module.exports = mongoose.model("Album", albumSchema);
