const forEach = require('lodash.foreach')
const server = require('graygelf/server')()
const gelfForward = require('./adapters/gelf-forward')(server)

const slack = require('./adapters/slack')
const seq = require('./adapters/seq')
const azure = require('./adapters/azure-msg-queue')
const local = require('./adapters/local-echo')

const adapters = [
	azure,
	local,
	seq,
	slack
]

server.on('message', gelf => forEach(adapters, adapter => adapter(gelf)))

server.listen(12201)
console.log('Server listening on Port 12201')



