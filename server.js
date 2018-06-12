// Connect to database
const mongoose = require('mongoose');
const { dbpassword, dbroute, dbuser } = require('./credentials');
mongoose.connect(`mongodb://${ dbuser }:${ dbpassword }@${ dbroute }`);

// Get models
const Song = require('./app/models/song');

// Configure app
const express = require('express');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

// API routes
const router = express.Router();

// Middleware
router.use((req, res, next) => {
	console.log('Making request');
	next();
});

router.get('/', (req, res) => {
	res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/songs')
	.post((req, res) => {
		let song = new Song();
		song.title = req.body.title;
		song.album = req.body.album;
		song.artist = req.body.artist;
		song.imageURL = req.body.imageURL;
		song.save(err => {
			if (err) {res.send(err);}
			res.json({ message: 'Song created!' });
		});
	})
	.get((req, res) => {
		Song.find((err, songs) => {
			if (err) {res.send(err);}
			res.json(songs);
		});
	});

router.route('/songs/:song_id')
	.get((req, res) => {
		Song.findById(req.params.song_id, (err, song) => {
			if (err) {res.send(err);}
			res.json(song);
		});
	})
	.put((req, res) => {
		Song.findById(req.params.song_id, (err, song) => {
			if (err) {res.send(err);}
			song.title = req.body.title;
			song.album = req.body.album;
			song.artist = req.body.artist;
			song.imageURL = req.body.imageURL;
			song.save(err => {
				if (err) {res.send(err);}
				res.json({ message: 'Song updated!' });
			});
		});
	})
	.delete((req, res) => {
		Song.remove({ _id: req.params.song_id }, (err, song) => {
			if (err) {res.send(err);}
			res.json({ message: 'Successfully deleted' });
		});
	});

// START THE SERVER
app.use('/api', router);
app.listen(port);
console.log(`Starting server on port ${ port }`);
