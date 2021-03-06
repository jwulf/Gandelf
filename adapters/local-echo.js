const config = require('../configuration')
const chalk = require('chalk')
const size = require('lodash.size')

const { Local } = config || {}
const { echo } = Local || {}

const colors = [
	chalk.cyan,
	chalk.yellow,
	chalk.cyan,
	chalk.blue,
	chalk.magenta
]

const initialise = ({containers, init}) => ({containers, init: !!echo})

const echoFn = ({containers, init}) => gelf => {
	if (!init) { return }
	const name = gelf._container_name || 'default'
	containers[name] = containers[name] || colors[(size(containers) % colors.length)]
	const colorised = containers[name] || chalk.white
	console.log(colorised(`[${name}] - ${gelf.short_message}`))
}

const LocalJSONLogging = chalk.yellow('Local JSON Logging: ')
if (!echo) {
	console.log(chalk.bold(LocalJSONLogging + chalk.red('Disabled')))
} else {
	console.log(chalk.bold(LocalJSONLogging + chalk.green('Enabled')))
}

module.exports = echoFn(initialise({containers: {}, init: false}))
