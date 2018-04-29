const config = require('../configuration')
const chalk = require('chalk')
const healthcheck = require('healthchecks.io');

const { Healthchecksio } = config
const { heartbeat, url } = Healthchecksio || {}

const Heartbeat = chalk.yellow('Healthchecks.io heartbeat: ')
if (url) {
	console.log(chalk.bold(Heartbeat + chalk.green(`Enabled - ${heartbeat} mins`)))
	healthcheck(url, heartbeat)
} else {
	console.log(chalk.bold(Heartbeat + chalk.red('Disabled')))
}

