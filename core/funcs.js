/* === === === === === */
/* Get configs
/* === === === === === */

const mode = process.env.NODE_ENV || 'production';
const debug = mode === 'development';

const config = require('../core/config');

/* === === === === === */
/* Define functions
/* === === === === === */

module.exports = {

	validateUsername(username = '') {

		return (new RegExp(`[${config[mode].rules.username.pattern}]{${config[mode].rules.username.min},${config[mode].rules.username.max}}$`)).test(username);

	}

}