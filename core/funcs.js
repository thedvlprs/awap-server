const mongodb = require('mongodb');

/* === === === === === */
/* Get configs
/* === === === === === */

const mode = process.env.NODE_ENV || 'production';
const debug = mode === 'development';

const config = require('../core/config')[mode];

/* === === === === === */
/* Define functions
/* === === === === === */

module.exports = {

	debug, config,

	/* === === === === === */
	/* Validate username
	/* === === === === === */

	validateUsername: (username) => (/[\w]{4,15}$/).test(username),

	/* === === === === === */
	/* Working with DB
	/* === === === === === */

	$db: (collection) => new Promise((connected, error) => {

		mongodb.connect(`mongodb://${config.db.host}`, {
			useNewUrlParser: true
		}, (err, client) => {
			
			if(err) return error(err);

			let db = client.db(config.db.name);
			let $users = db.collection(collection);

			return connected($users);

		});

	})

}