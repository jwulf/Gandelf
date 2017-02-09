const gelfserver = require('graygelf/server');
const server = gelfserver();
const slackMessage = require('./adapters/slack').slackMessage;
const seqMessage = require('./adapters/seq').seqMessage;
const azureMessage = require('./adapters/azure-msg-queue').azureMessage;
let general = 'general';
let msgCount = 0;

const NAME = process.env.GELF_NAME || null;

const short = (long) => { return long.split('.')[0] }

server.on('message', (gelf) => {
	msgCount += 1;
	console.log(`Message Count: ${mgsCount}`);
	if (!gelf || !gelf.host || !gelf.short_message) { return; }
	const name = NAME || short(gelf.host);
	slackMessage(gelf.short_message, name);
	seqMessage(gelf);
	azureMessage(gelf.short_message);
});

server.listen(12201);
console.log('Server listening on Port 12201');
