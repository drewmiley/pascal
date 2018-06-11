const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
	title: String,
	album: String,
	artist: String,
	imageURL: String
});

module.exports = mongoose.model('Song', SongSchema);
