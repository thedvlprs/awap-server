const express = require('express');
const mongodb = require('mongodb');
const otplib = require('otplib').authenticator;

const router = express.Router();

/* === === === === === */
/* Extra
/* === === === === === */

const {config, $db, validateUsername} = require('../core/funcs');

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
	/* Connect to db
	/* === === === === === */

	$db('users').then(($users) => {

		let _username = username.toLowerCase();

		/* === === === === === */
		/* Get user`s token
		/* === === === === === */

		$users.findOne({
			username: _username
		}).then((user) => {
			
			if(!user || !otplib.check(code, user.token)) return res.status(401).send({

				/* === === === === === */
				/* When unauthorized
				/* === === === === === */

				error: 401,
				details: {
					message: 'Authentication failed'
				}

			});

			/* === === === === === */
			/* When authorized
			/* === === === === === */

			return res.status(200).send({
				error: null,
				message: 'Authentication success',
				user
			});

		});

	}).catch((error) => {
		console.error(error);

		res.status(500).send({
			error: 500,
			details: error
		});
	});

})

module.exports = router;