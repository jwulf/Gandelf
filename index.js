const gelfserver = require('graygelf/server')
const server = gelfserver();
var Bottleneck = require("bottleneck"); 
var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var bot_token = process.env.SLACK_API_TOKEN || '';

var init = false;
var rtm = new RtmClient(bot_token);
var limiter = new Bottleneck(1, 800);

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED,  (rtmStartData) => {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
	console.log('Yo');
	init = true;
  	rtm.sendMessage('#general', "Hello!",  (err, res) => { console.log(err); });
});

rtm.start();

var channels = {};

const short = (long) => { return long.split('.')[0] }

rtm.on('channel_joined', (evt) => {
	console.log(evt);
	channels[evt.channel] = true;
})

const announce = (channel, msg) => { 
	const send = (text) => { limiter.submit(rtm.sendMessage,text, channel, 
		(err, res) => { if (err) { console.log(err) } }); }
	if (msg && msg.short_message) { send(msg.shortmessage) }
}

server.on('message', (gelf) => {
	if (!gelf || !gelf.host || !init) return;
	const name = short(gelf.host);
	if (channels[name]) { return announce(`#${name}`, gelf) }
	announce('#general', name);
});

server.listen(12201);



