const gelfserver = require('graygelf/server');
const server = gelfserver();
const slackMessage = require('./adapters/slack').slackMessage;
const seqMessage = require('./adapters/seq').seqMessage;
let general = 'general';

const NAME = process.env.GELF_NAME || null;

const short = (long) => { return long.split('.')[0] }

server.on('message', (gelf) => {
	if (!gelf || !gelf.host || !gelf.short_message) { return; }
	const name = NAME || short(gelf.host);
	slackMessage(gelf.short_message, name);
	seqMessage(gelf);
});

server.listen(12201);
console.log('Server listening on Port 12201');
