const gelfserver = require('graygelf/server')
const server = gelfserver();
var Bottleneck = require("bottleneck"); 

var bot_token = process.env.SLACK_API_TOKEN || '';

let init = false;
let general;

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var rtm = new RtmClient(bot_token);

var limiter = new Bottleneck(1, 800);

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED,  (rtmStartData) => {
  sd = rtmStartData;
  for (const c of sd.channels) {
	  if (c.is_member) {
		  channels[c.name] = c.id;
		  if (c.name === 'general') { general = c.id}
		}
  }
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
  console.log(`Member of general at ${general}`);
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, (res) => {
	init = true;
	console.log('Connected!');
	console.log(`Logging to ${general}`);
  //	rtm.sendMessage("Hello!", general,  (err, res) => { console.log(err); });

	const announce = (channel, msg) => { 
		const send = (text) => { 
			console.log(channel);
			rtm.sendMessage(text, channel), 
			(err, res) => { if (err) { console.log(err) } 
			if (res) console.log(res) } 
		}
		if (msg && msg.short_message && channel) { limiter.submit(send, msg.short_message) }
	}

	server.on('message', (gelf) => {
		console.log(gelf.short_message)
		if (!gelf || !gelf.host || !init) return;
		const name = short(gelf.host);
		if (channels[name]) { return announce(channels[name].id, gelf) }
		announce(general, {short_message: name});
		announce(general, gelf);
	});


});

rtm.start();

var channels = {};

const short = (long) => { return long.split('.')[0] }

rtm.on('channel_joined', (evt) => {
	console.log('Channel joined');
	console.log(evt);
//	channels[evt.channel.name] = evt.channel.id;
})



server.listen(12201);



