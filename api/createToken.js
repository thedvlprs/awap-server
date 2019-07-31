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
/* Create token
/* === === === === === */

router.get('/', (req, res) => {
	
	/* === === === === === */
	/* Get username
	/* === === === === === */

	let {username} = req.query;

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
	/* Search user
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
	/* If not found
	/* === === === === === */

	let token = otplib.generateSecret();

	return res.status(200).send({
		error: null,
		message: `User with username "${username}" not found`,
		token,
		OTPURI: otplib.keyuri(username, 'AWAP', token)
	});

})

module.exports = router;