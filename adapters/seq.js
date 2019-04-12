const structuredLog = require('structured-log')
const seqSink = require('../lib/structured-log-seq-sink')
const config = require('../configuration')
const chalk = require('chalk')

const { Seq } = config || {}
const { SEQ_URL, SEQ_API_KEY } = Seq || {}

function initialise() {
    const logger = SEQ_URL
        ? structuredLog.configure()
            .writeTo(seqSink({
                url: SEQ_URL,
                apiKey: SEQ_API_KEY,
                compact: true
            }))
            .create()
        : undefined;

    const SeqLogging = chalk.yellow('Seq Logging: ');

    if (logger) {
        console.log(chalk.bold(SeqLogging + chalk.green('Enabled')))
        seqMessage({short_message: 'Seq logging is enabled', a: 1})
    } else {
        console.log(chalk.bold(SeqLogging + chalk.red('Disabled')))

    }
    return ({ init: !!logger, logger })
}

function parseJson(str) {
    try {
        return JSON.parse(str)
    } catch (e) {
        return str
    }
}

const seqMessage = ({init, logger}) => gelf => {
    if (!init) { return }
    var shortMessage = gelf.short_message || '<No message>'
    var fields = Object.assign({}, gelf)
    var parsed = parseJson(shortMessage)
    if(typeof parsed === 'object') {
      Object.assign(fields, parsed)
      if(parsed['@mt']) shortMessage = parsed['@mt']
    }
    
    delete fields.short_message
    delete fields.host
    delete fields.version
    delete fields.timestamp
    logger.enrich(fields).info(shortMessage)
}

module.exports = seqMessage(initialise())
