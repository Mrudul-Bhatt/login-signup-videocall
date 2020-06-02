const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { MONGO_URI } = require('./keys');

require('./models/user');
const app = express();

//Routes
const authRoutes = require('./routes/auth');

//Middlewares
app.use(express.json());
app.use(authRoutes);

//Db
mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDb connected!'))
	.catch((error) => console.log(error));

app.listen(process.env.PORT, () => {
	console.log('server started');
});
