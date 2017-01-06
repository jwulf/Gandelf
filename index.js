const gelfserver = require('graygelf/server')
const server = gelfserver();
var Bottleneck = require("bottleneck"); 
var Bot = require('slackbots');

var bot_token = process.env.SLACK_API_TOKEN || '';

let init = false;
let general = 'general';

var settings = {
    token: bot_token,
    name: 'gandelf'
};

var bot = new Bot(settings);

var limiter = new Bottleneck(0, 800);

general = 'general'
var channels = {};

bot.on('channel_joined', (evt) => {
	console.log('Channel joined');
	console.log(evt);
	channels[evt.channel.name] = evt.channel.name;
})

bot.on('start',  () => {
	bot.getChannels().always((chans) => {
		let chanlist = '';
		for (const chan of chans._value.channels) {
			if (chan.is_member) {
				channels[chan.name] = chan.name;
				chanlist += `${chan.name} `;
			}
		}
		announce('general', `Gandelf alive. Currently in these channels: ${chanlist}`);
	});

});

const announce = (channel, msg) => { 
	const send = (text) => { 
		return new Promise( (resolve, reject) => {
			bot.postMessageToChannel(channel, text).always((data) => resolve);
		});
	}

	let txt;
	if (typeof msg === "string") { txt = msg }
	if (msg && msg.short_message) { txt = msg.short_message }

	limiter.schedule(send, txt).then((data)=> console.log); 
}

const short = (long) => { return long.split('.')[0] }

server.on('message', (gelf) => {
	if (!gelf || !gelf.host || !init || gelf.short_message) { return; }

	const name = short(gelf.host);
	if (channels[name]) { return announce(channels[name], gelf.short_message) }
	announce(general, `${name} - ${gelf.short_message}`);
});


server.listen(12201);
