const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.post('/signup', (req, res) => {
	const { name, email, password } = req.body;

	if (!email || !password || !name) {
		return res.status(422).json({ message: 'Please enter all fields' });
	}
	//res.json({ message: 'signedup successfully' });

	User.findOne({ email: email })
		.then((savedUser) => {
			if (savedUser) {
				res.status(422).json({ message: 'Email already exists' });
			}

			bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const newUser = new User({
						email,
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
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(422).json({ message: 'enter all details' });
	}
	User.findOne({ email: email })
		.then((savedUser) => {
			if (!savedUser) {
				return res.status(422).json({ message: 'invalid email or password!' });
			}
			bcrypt
				.compare(password, savedUser.password)
				.then((doMatch) => {
					if (doMatch) {
						return res.json({ message: 'signed in success' });
					} else {
						return res
							.status(422)
							.json({ message: 'invalid email or password!' });
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
