const express = require('express');

const Post = require('../models/post');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

router.get('/allpost', (req, res) => {
	Post.find()
		.populate('postedBy', '_id name')
		.then((posts) => {
			res.json({ posts });
		})
		.catch((error) => console.log(error));
});

router.get('/mypost', requireLogin, (req, res) => {
	Post.find({ postedBy: req.user._id })
		.populate('postedBy', '_id name')
		.then((mypost) => res.json({ mypost }))
		.catch((error) => console.log(error));
});

router.post('/createpost', requireLogin, (req, res) => {
	const { title, body } = req.body;
	if (!title || !body) {
		return res.status(422).json({ message: 'Please enter all fields' });
	}
	//baring from storing password in req.user
	req.user.password = undefined;

	const newPost = new Post({
		title,
		body,
		postedBy: req.user,
	});

	newPost
		.save()
		.then((createdPost) => {
			res.json({ createdPost });
		})
		.catch((error) => console.log(error));
});

module.exports = router;
