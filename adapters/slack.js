const Bottleneck = require("bottleneck")
const Bot = require('slackbots')
const config = require('../configuration')

function initialise() {
    const init = { ready: false }
    const channels = {}
    const bot_token = config.Slack.bot_token

    const settings = {
        token: bot_token,
        name: 'gandelf'
    }

    const bot = bot_token
        ? new Bot(settings)
        : undefined

    const limiter = new Bottleneck(0, config.Slack.rate_limit) // 400 ms default

    if (config.bot_token) {
        console.log('Enabling Slack logging')


        bot.on('channel_joined', (evt) => {
            console.log('Slack channel joined')
            console.log(evt)
            channels[evt.channel.name] = evt.channel.name
        })

        bot.on('start',  () => {
            bot.getChannels().always((chans) => {
                let chanlist = ''
                for (const chan of chans._value.channels) {
                    if (chan.is_member) {
                        channels[chan.name] = chan.name
                        chanlist += `${chan.name} `
                    }
                }
                init.ready = true
                message('general', `Gandelf alive. Currently in these channels: ${chanlist}`)
            })
        })
    }
    return ({ init, bot, limiter, channels})
}



const slackMessage = ({bot, limiter, init, channels}) => (msg, name) => {

    const message = (channel, msg) => {
        const send = text => {
            return new Promise((resolve, reject) => bot.postMessageToChannel(channel, text).always((data) => resolve))
        }

        const txt = (typeof msg === "string")
            ? msg
            : (msg && msg.short_message)
                ? msg.short_message
                : undefined

        limiter.schedule(send, txt).then((data)=> console.log)
    }

    if (!bot_token || !init.ready) { return }
	if (channels[name]) { return message(channels[name], msg) }
	message(general, `${name} - ${msg}`)
}

module.exports.slackMessage = slackMessage(initialise());