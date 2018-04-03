const graygelf = require('graygelf')
const config = require('../configuration')
const chalk = require('chalk')

const url = config.Gelf.url

function initialise() {
	const url = config.Gelf.url
	const GelfForwarding = chalk.yellow('Gelf forwarding: ')
	if (url) {
		console.log(chalk.bold(GelfForwarding + chalk.green('Enabled')))
		return graygelf(url)
	}
	console.log(chalk.bold(GelfForwarding + chalk.red('Disabled')))
	return undefined
}

const forward = client => server => (client && server.pipe(client))

module.exports = forward(initialise())