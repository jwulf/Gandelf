const gelfserver = require('graygelf/server')
const Slack = require('slack-node');
const apiToken = process.env.SLACK_API_TOKEN;
const server = gelfserver();

slack = new Slack(apiToken);
var channels = {};

server.on('message', (gelf) => {
	console.log('received message', gelf);
	if (!channels[gelf.host]) {
		slack.api('channels.join', { name: gelf.host }, (res) => {
			if (res && !res.ok) { return announce('#general', gelf); }
			channels[gelf.host] = res;
			announce('#general', `New Channel: ${gelf.host}`)
			return announce(`#${gelf.host}`, gelf);
		});
		return;
	}
	announce(`#${gelf.host}`, gelf);
});

server.listen(12201);

const joinChannel = (channel, cb) => { slack.api('channels.join', { name: channel }, cb) }

const announce = (channel, msg) => { 
	const send = (text) => {
		slack.api('chat.postMessage', { text, channel }, (err, res) => { console.log(res); });
		console.log(text);
	}
	("undefined" != typeof msg, msg.short_message && send(msg.shortmessage))
	("undefined" != typeof msg, msg.full_message && send(msg.full_message));
}

announce(
	'#general',
	'A wizard is never late. He arrives precisely when he means to!'
);