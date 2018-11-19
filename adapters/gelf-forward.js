const graygelf = require('graygelf')
const config = require('../configuration')
const chalk = require('chalk')

const { Gelf } = config || {}
const { url } = Gelf || {}

function initialise() {
	const GelfForwarding = chalk.yellow('Gelf forwarding: ')
	try {
		if (url) {
			console.log(chalk.bold(GelfForwarding + chalk.green('Enabled')))
			return graygelf(url)
		}
	} catch(e) {
		console.log(e)
	}
	console.log(chalk.bold(GelfForwarding + chalk.red('Disabled')))
	return undefined
}

const forward = client => server => (client && server.pipe(client))

module.exports = forward(initialise())