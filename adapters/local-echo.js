const config = require('../configuration')
const chalk = require('chalk')
const size = require('lodash.size')

const colors = [
	chalk.green,
	chalk.yellow,
	chalk.blue,
	chalk.cyan,
	chalk.magenta
]

const initialise = ({containers, init}) => ({containers, init: !!config.Local.echo})

const echo = ({containers, init}) => gelf => {
	if (!init) { return }
	const name = gelf._container_name || 'default'
	containers[name] = containers[name] || colors[(size(containers) % colors.length)]
	const colorised = containers[name] || chalk.white
	console.log(colorised(`${name} - ${gelf.short_message}`))
}

module.exports = echo(initialise({containers: {}, init: false}))
