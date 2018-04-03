const config = require('../configuration')
const chalk = require('chalk')
const size = require('lodash.size')

const colors = [
	chalk.cyan,
	chalk.yellow,
	chalk.cyan,
	chalk.blue,
	chalk.magenta
]

const initialise = ({containers, init}) => ({containers, init: !!config.Local.echo})

const echo = ({containers, init}) => gelf => {
	if (!init) { return }
	const name = gelf._container_name || 'default'
	containers[name] = containers[name] || colors[(size(containers) % colors.length)]
	const colorised = containers[name] || chalk.white
	console.log(colorised(`[${name}] - ${gelf.short_message}`))
}

const LocalJSONLogging = chalk.yellow('Local JSON Logging: ')
if (!config.Local.echo) {
	console.log(chalk.bold(LocalJSONLogging + chalk.red('Disabled')))
} else {
	console.log(chalk.bold(LocalJSONLogging + chalk.green('Enabled')))
}

module.exports = echo(initialise({containers: {}, init: false}))
