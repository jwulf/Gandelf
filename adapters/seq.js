const structuredLog = require('structured-log');
const seqSink = require('../lib/structured-log-seq-sink');
const config = require('../configuration')

'use strict';

function initialise() {
    const logger = config.SEQ_URL
        ? logger = structuredLog.configure()
            .writeTo(seqSink({
                url: SEQ_URL,
                apiKey: SEQ_API_KEY,
                compact: true
            }))
            .create()
        : undefined
        if (logger) {
            console.log('Enabling Seq logging adapter')
            seqMessage({short_message: 'Seq logging is enabled', a: 1})
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