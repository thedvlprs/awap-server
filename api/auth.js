const express = require('express');
const otplib = require('otplib').authenticator;

const router = express.Router();

const db = require('../core/db');

/* === === === === === */
/* Get configs
/* === === === === === */

const mode = process.env.NODE_ENV || 'production';
const debug = mode === 'development';

const config = require('../core/config');

/* === === === === === */
/* Extra
/* === === === === === */

const {validateUsername} = require('../core/funcs');

/* === === === === === */
/* Auth user
/* === === === === === */

router.get('/', (req, res) => {

	/* === === === === === */
	/* Get username
	/* === === === === === */

	let {username, code} = req.query;

	/* === === === === === */
	/* Check user data
	/* === === === === === */

	if(!username || !code) return res.status(400).send({
		error: 400,
		details: {
			message: 'Please provide username and OTP code'
		}
	});

	/* === === === === === */
	/* Validate username
	/* === === === === === */

	if(!validateUsername(username)) return res.status(400).send({
		error: 400,
		details: {
			message: 'Invalid username'
		}
	});

	/* === === === === === */
	/* Validate OTP Code
	/* === === === === === */

	if(!(/\d{6}$/).test(code)) return res.status(400).send({
		error: 400,
		details: {
			message: 'Invalid OTP code'
		}
	});

	/* === === === === === */
	/* Do action
	/* === === === === === */

	let user = db.get('users').find({username: username.toLowerCase()}).value();

	/* === === === === === */
	/* Not authorized
	/* === === === === === */

	if(!user || otplib.generate(user.token) !== code) return res.status(401).send({
		error: 401,
		details: {
			message: 'Not authorized'
		}
	});

	/* === === === === === */
	/* Authorized
	/* === === === === === */

	return res.status(200).send({
		error: null,
		message: 'OK',
		user
	})

})

module.exports = router;