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
	const name = gelf._container_name
	containers[name] = containers[name] || { color: colors[(size(containers) % colors.length) - 1] }
	console.log(containers[name].color(`${name} - ${gelf.short_message}`))
}

module.exports = echo(initialise({containers: {}, init: false}))
