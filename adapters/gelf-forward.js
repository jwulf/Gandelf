const client = require('graygelf')
const config = require('../configuration')

function forward(server) {
	const url = config.Gelf.url
	if (url) {
		server.pipe(client(url))
	}
}

module.exports = { forward }