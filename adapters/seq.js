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
    logger.info('{@msg}',msg);
}

module.exports.seqMessage = seqMessage;