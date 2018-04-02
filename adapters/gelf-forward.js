const graygelf = require('graygelf')
const config = require('../configuration')
const url = config.Gelf.url

function initialise() {
	const url = config.Gelf.url
	if (url) {
		console.log('Enabling GELF Forwarding adapter')
		return graygelf(url)
	}
	return undefined
}

const forward = client => server => {
	if (client) server.pipe(client)
}

module.exports = forward(initialise())