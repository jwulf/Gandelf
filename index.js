const gelfserver = require('graygelf/server')
const Slack = require('slack-node');
const apiToken = process.env.SLACK_API_TOKEN;
const server = gelfserver();

slack = new Slack(apiToken);
var channels = {};

const short = (long) => { return long.split('.')[0] }

const joinChannel = (name, cb) => { slack.api('channels.join', { name }, cb) }

slack.on('channel_joined', (evt) => {
	channels[evt.channel] = true;
})

server.on('message', (gelf) => {
	if (!gelf || !gelf.host) return;
	const name = short(gelf.host);
	if (channels[name]) { return announce(`#${name}`, gelf) }
	announce('#general', gelf);
	if (channels[name] !== false) { joinChannel(name), (res) => {
		channels[name] = channels[name] || (res && res.ok)
	}
}});

server.listen(12201);

const announce = (channel, msg) => { 
	const send = (text) => {
		slack.api('chat.postMessage', { text, channel }, (err, res) => { console.log(res) });
		console.log(text);
	}
	if (msg && msg.short_message) { send(msg.shortmessage) }
	if (msg && msg.full_message)  { send(msg.full_message) }
}

announce(
	'#general',
	'A wizard is never late. He arrives precisely when he means to!'
);