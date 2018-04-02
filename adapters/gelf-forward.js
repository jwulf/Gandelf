const client = require('graygelf')
const config = require('../configuration')

function forward(server) {
	const url = config.Gelf.url
	if (url) {
		console.log('Enabling GELF Forwarding adapter')
		server.pipe(client(url))
	}
}

module.exports = forward