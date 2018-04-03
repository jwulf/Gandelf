const Bottleneck = require("bottleneck")
const Bot = require('slackbots')
const config = require('../configuration')
const chalk = require('chalk')

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

    const SlackLogging = chalk.yellow('Slack Logging: ')
    if (config.bot_token) {
        console.log(chalk.bold(SlackLogging + chalk.green('Enabled')))

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
    } else {
        console.log(chalk.bold(SlackLogging + chalk.red('Disabled')))
    }
    return ({ init, bot, limiter, channels})
}


const short = long => long.split('.')[0]
const getMessage = msg => (typeof msg === "string") ? msg : (msg && msg.short_message) ? msg.short_message : undefined

const slackMessage = ({bot, limiter, init, channels}) => gelf => {
    if (!init.ready) { return }

    const message = ({channel, msg}) => {
        const send = async text => await bot.postMessageToChannel(channel, text)
        const txt = getMessage(msg)
        limiter.schedule(send, txt)
    }

    const msg = getMessage(gelf)
    const name = short(gelf.host)
	const channel = channels[name] ? channels[name] : 'general'
	return message({channel, msg: `${name} - ${msg}`})
}

module.exports = slackMessage(initialise());