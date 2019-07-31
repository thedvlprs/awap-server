module.exports = {

	/* === === === === === */
	/* Development
	/* === === === === === */

	development: {

		/* === === === === === */
		/* HTTP
		/* === === === === === */

		http: {
			ip: '0.0.0.0',
			port: 8002
		},

		rules: {
			username: {
				min: 4, max: 15, pattern: "\\w"
			}
		}
	},

	/* === === === === === */
	/* Production
	/* === === === === === */

	production: {

		/* === === === === === */
		/* HTTP
		/* === === === === === */

		http: {
			ip: '127.0.0.1',
			port: 8002
		},

		rules: {
			username: {
				min: 4, max: 15, pattern: "\\w"
			}
		}
	}

}