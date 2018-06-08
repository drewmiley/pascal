// Connect to database
const mongoose = require('mongoose');
const { dbpassword, dbroute, dbuser } = require('./credentials');
mongoose.connect(`mongodb://${ dbuser }:${ dbpassword }@${ dbroute }`);

// Get models
const Bear = require('./app/models/bear');

// Configure app
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
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

router.route('/bears')
	.post((req, res) => {
		let bear = new Bear();
		bear.name = req.body.name;
		bear.save(err => {
			if (err) {
				res.send(err);
			}
			res.json({ message: 'Bear created!' });
		});
	})
	.get((req, res) => {
		Bear.find((err, bears) => {
			if (err) {
				res.send(err);
			}
			res.json(bears);
		});
	});

router.route('/bears/:bear_id')
	.get((req, res) => {
		Bear.findById(req.params.bear_id, (err, bear) => {
			if (err) {
				res.send(err);
			}
			res.json(bear);
		});
	})
	.put((req, res) => {
		Bear.findById(req.params.bear_id, (err, bear) => {
			if (err) {
				res.send(err);
			}
			bear.name = req.body.name;
			bear.save(err => {
				if (err) {
					res.send(err);
				}
				res.json({ message: 'Bear updated!' });
			});
		});
	})
	.delete((req, res) => {
		Bear.remove({ _id: req.params.bear_id }, (err, bear) => {
			if (err) {
				res.send(err);
			}
			res.json({ message: 'Successfully deleted' });
		});
	});

// START THE SERVER
app.use('/api', router);
app.listen(port);
console.log(`Starting server on port ${ port }`);