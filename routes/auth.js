//Package Imports
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//File Imports
const User = require('../models/user');
const { JWT_SECRET_KEY } = require('../keys');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

// router.get('/p', requireLogin, (req, res) => {
// 	res.send('hello');
// 	console.log(req.user);
// 	res.json(req.user);
// });

router.get('/allcontacts', requireLogin, (req, res) => {
	User.find()
		.then((allcontacts) => {
			res.json({ allcontacts });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: 'server is down' });
		});
});

router.post('/signup', (req, res) => {
	const { name, phone, password } = req.body;

	if (!phone || !password || !name) {
		return res.status(422).json({ message: 'Please enter all fields' });
	}
	//res.json({ message: 'signedup successfully' });

	User.findOne({ phone: phone })
		.then((savedUser) => {
			if (savedUser) {
				return res.status(422).json({ message: 'Phone no. already exists' });
			}

			bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const newUser = new User({
						phone,
						password: hashedPassword,
						name,
					});
					newUser
						.save()
						.then((user) =>
							res.json({ message: 'user account created successfully' })
						)
						.catch((error) => {
							console.log(error);
							res.status(422).json({ message: 'something went wrong' });
						});
				})
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			console.log(error);
		});
});

router.post('/signin', (req, res) => {
	const { phone, password } = req.body;

	if (!phone || !password) {
		return res.status(422).json({ message: 'enter all details' });
	}
	User.findOne({ phone: phone })
		.then((savedUser) => {
			if (!savedUser) {
				return res.status(422).json({ message: 'invalid phone or password!' });
			}
			bcrypt
				.compare(password, savedUser.password)
				.then((doMatch) => {
					if (doMatch) {
						//return res.json({ message: 'signed in success' });

						//generating token on basis of userId (_id)
						const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET_KEY);
						res.json({ token });
					} else {
						return res
							.status(422)
							.json({ message: 'invalid phone or password!' });
					}
				})
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			console.log(error);
		});
});

module.exports = router;
