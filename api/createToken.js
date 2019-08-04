const express = require('express');
const otplib = require('otplib').authenticator;
const router = express.Router();

/* === === === === === */
/* Extra
/* === === === === === */

const {config, $db, validateUsername} = require('../core/funcs');

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
	/* Connect to DB
	/* === === === === === */

	$db('users').then(($users) => {

		let _username = username.toLowerCase();

		/* === === === === === */
		/* Search users with same username
		/* === === === === === */
		
		$users.countDocuments({
			username: _username
		}).then((amount) => {
			
			/* === === === === === */
			/* When same user found
			/* === === === === === */
			
			if(amount) return res.status(409).send({
				error: 409,
				details: {
					message: 'User with same username already registered'
				}
			});

			/* === === === === === */
			/* Generate a token
			/* === === === === === */

			let token = otplib.generateSecret();

			return res.status(200).send({
				error: null,
				message: `OK`,
				token,
				OTPURI: otplib.keyuri(username, 'AWAP', token)
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