const express = require('express');
const mongodb = require('mongodb');
const formidable = require('formidable');
const otplib = require('otplib').authenticator;

const router = express.Router();

/* === === === === === */
/* Extra
/* === === === === === */

const {debug, config, validateUsername, $db} = require('../core/funcs');

/* === === === === === */
/* Register a user
/* === === === === === */

router.post('/', (req, res) => {
	
	let form = new formidable.IncomingForm;

	form.maxFileSize = 0;

	form.parse(req, (error, fields) => {

		if(error) {
			console.error(error);
			return res.status(500).send({
				error: 500,
				details: error
			})
		}
		
		/* === === === === === */
		/* Get user data
		/* === === === === === */

		const {
			username, token, code
		} = fields;

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
		/* Check OTP
		/* === === === === === */

		if(!debug && !otplib.check(code, token)) return res.status(400).send({
			error: 400,
			details: {
				message: 'OTP action failed. Check your OTP code'
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

			return $users.countDocuments({
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
				/* Save user to db
				/* === === === === === */

				return $users.insert({

					/* === === === === === */
					/* User data to save
					/* === === === === === */

					username: _username,
					displayName: username,
					token,
					regTS: new Date()

				}).then((result) => res.status(200).send({

					/* === === === === === */
					/* Response when done
					/* === === === === === */

					error: null,
					message: 'User successfully regirestered',
					user: result.ops[0]

				}));

			});

		}).catch((error) => {
			console.error(error);

			res.status(500).send({
				error: 500,
				details: error
			});
		});

	});

})

module.exports = router;