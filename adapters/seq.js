const structuredLog = require('structured-log');
const seqSink = require('../lib/structured-log-seq-sink');
const config = require('../configuration')
const chalk = require('chalk')

function initialise() {
    const logger = config.Seq.SEQ_URL
        ? structuredLog.configure()
            .writeTo(seqSink({
                url: config.Seq.SEQ_URL,
                apiKey: config.Seq.SEQ_API_KEY,
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

const seqMessage = ({init, logger}) => gelf => {
    if (!init) { return }
    var shortMessage = gelf.short_message || '<No message>'
    var fields = Object.assign({}, gelf)
    delete fields.short_message
    logger.enrich(fields).info(shortMessage)
}

module.exports = seqMessage(initialise())