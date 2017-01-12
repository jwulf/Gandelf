var structuredLog = require('structured-log');
var seqSink = require('../lib/structured-log-seq-sink');

var logger = structuredLog.configure()
  .writeTo(seqSink({
    url: 'http://magik-seq.southeastasia.cloudapp.azure.com',
    compact: true
}))
  .create();

console.log('Seq logging is enabled');
logger.info('Seq logging is enabled');

function seqMessage(msg) {
    var shortMessage = msg.short_message || '<No message>';
    var fields = {...msg};
    delete fields.short_message;
    logger.enrich(msg).info(shortMessage);
}

module.exports.seqMessage = seqMessage;