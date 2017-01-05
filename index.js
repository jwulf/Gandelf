const gelfserver = require('graygelf/server')
const server = gelfserver();

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var bot_token = process.env.SLACK_API_TOKEN || '';

let init = false;
var rtm = new RtmClient(bot_token);

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED,  (rtmStartData) => {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
  rtm.sendMessage("Hello!", channel);
  init = true;
});

rtm.start();

var channels = {};

const short = (long) => { return long.split('.')[0] }

rtm.on('channel_joined', (evt) => {
	channels[evt.channel] = true;
})

server.on('message', (gelf) => {
	if (!gelf || !gelf.host || !init) return;
	const name = short(gelf.host);
	if (channels[name]) { return announce(`#${name}`, gelf) }
	announce('#general', gelf);
});

server.listen(12201);

const announce = (channel, msg) => { 
	const send = (text) => { rtm.sendMessage(text, channel) }
	if (msg && msg.short_message) { send(msg.shortmessage) }
	if (msg && msg.full_message)  { send(msg.full_message) }
}

announce(
	'#general',
	'A wizard is never late. He arrives precisely when he means to!'
);