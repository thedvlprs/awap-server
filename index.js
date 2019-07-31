const express = require('express');
const rateLimit = require("express-rate-limit");
const cors = require('cors');
const bodyParser = require('body-parser');

/* === === === === === */
/* Vars & Sets
/* === === === === === */

const mode = process.env.NODE_ENV || 'production';
const debug = mode === 'development';

const config = require('./core/config');

const app = express();

app.set('trust proxy', 1);

/* === === === === === */
/* Enable cors
/* === === === === === */

app.use(cors());

/* === === === === === */
/* Enable bodyparser
/* === === === === === */

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

/* === === === === === */
/* Register API
/* === === === === === */

const registerAPI = require('./api/register');

app.use('/register', rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 10,
	message: {
		error: 429,
		details: {
			message: "Too many accounts registered. Try again later"
		}
	}
}), registerAPI);

/* === === === === === */
/* Create token API
/* === === === === === */

const createTokenAPI = require('./api/createToken');

app.use('/createToken', rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 10,
	message: {
		error: 429,
		details: {
			message: "Too many requests. Try again later"
		}
	}
}), createTokenAPI);

/* === === === === === */
/* Auth API
/* === === === === === */

const authAPI = require('./api/auth');
app.use('/auth', rateLimit({
	windowMs: 5 * 60 * 1000, // 1 hour
	max: 10,
	message: {
		error: 429,
		details: {
			message: "Too many requests. Try again later"
		}
	}
}), authAPI);

/* === === === === === */
/* Server listen
/* === === === === === */

app.listen(config[mode].http.port, config[mode].http.ip, () => {
	console.log(`HTTP Server started at ${config[mode].http.ip}:${config[mode].http.port}`);
});