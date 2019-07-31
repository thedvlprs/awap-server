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
/* Register a user
/* === === === === === */

router.post('/', (req, res) => {
	
	/* === === === === === */
	/* Get user data
	/* === === === === === */

	const {
		username, token, code
	} = req.body;

	/* === === === === === */
	/* Check user data
	/* === === === === === */

	if(!username || !token || !code) return res.status(400).send({
		error: 400,
		details: {
			message: 'Please provide username, token and OTP code'
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
	/* Validate token
	/* === === === === === */

	if(!(/\w{32}$/).test(token)) return res.status(400).send({
		error: 400,
		details: {
			message: 'Invalid token. It`s length must be 32 symbols'
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
	/* Check user exists
	/* === === === === === */

	let found = db.get('users').find({username: username.toLowerCase()}).value();

	/* === === === === === */
	/* If found
	/* === === === === === */

	if(found) return res.status(409).send({
		error: 409,
		message: `User with username "${username}" already exists`
	});

	/* === === === === === */
	/* Check OTP
	/* === === === === === */

	let OTPCode = otplib.generate(token);

	if(OTPCode !== code) return res.status(400).send({
		error: 400,
		details: {
			message: 'OTP action failed. Check your OTP code'
		}
	});

	/* === === === === === */
	/* Save info about user
	/* === === === === === */

	db.get('users').push({
		username: username.toLowerCase(),
		displayName: username,
		token,
		regTS: new Date(),
	}).write();

	res.status(200).send({
		error: null,
		message: 'OK',
		user: db.get('users').find({username: username.toLowerCase()}).value()
	});

})

module.exports = router;