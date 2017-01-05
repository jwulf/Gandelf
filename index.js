const gelfserver = require('graygelf/server')
const Slack = require('slack-node');
const apiToken = process.env.SLACK_API_TOKEN;
const server = gelfserver();

slack = new Slack(apiToken);
var channels = {};

server.on('message', (gelf) => {
	console.log('received message', gelf.short_message);
	if (!channels[gelf.host]) {
		slack.api('channels.join', { name: gelf.host }, (res) => {
			if (!res.ok) { return sendToChannel('general', gelf); }
			channels[gelf.host] = res;
			sendToChannel('general', `New Channel: ${gelf.host}`)
			return sendToChannel(gelf.host, gelf);
		});
		return;
	}
	sendToChannel(gelf.host, gelf);
});

server.listen(12201);

function sendToChannel(channel, msg) {
	function send(txt) {
		slack.api('chat.postMessage', {
			text: txt,
			channel: `#${channel}`
		}, (err, response) => { console.log(response); });
	}
	(gelf && gelf.short_message && true === send(gelf.shortmessage))
	(gelf && gelf.full_message && true === send(gelf.full_message));
}

console.log('A wizard is never late. He arrives precisely when he means to!');