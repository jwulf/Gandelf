const gelfserver = require('graygelf/server')

const slackMessage = require('./adapters/slack').message
const seqMessage = require('./adapters/seq').message
const azureMessage = require('./adapters/azure-msg-queue').message
const gelfForward = require('./adapters/gelf-forward').forward
const config = require('./configuration')


const server = gelfserver()
if (config.Gelf.url) {
	gelfForward(server)
}

server.on('message', gelf => {
	if (config.Local.echo) {
		console.log(gelf) // jsonlog
	}
	if (!gelf || !gelf.host || !gelf.short_message) { return }

	slackMessage(gelf)
	seqMessage(gelf)
	azureMessage(gelf)
});

server.listen(12201)
console.log('Server listening on Port 12201')



