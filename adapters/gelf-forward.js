const graygelf = require('graygelf')
const config = require('../configuration')
const chalk = require('chalk')

const url = config.Gelf.url

function initialise() {
	const url = config.Gelf.url
	if (url) {
		console.log(chalk.bold(chalk.yellow('Gelf forwarding: ') + chalk.green('Enabled')))
		return graygelf(url)
	}
	console.log(chalk.bold(chalk.yellow('Gelf forwarding: ') + chalk.red('Disabled')))
	return undefined
}

const forward = client => server => (client && server.pipe(client))

module.exports = forward(initialise())