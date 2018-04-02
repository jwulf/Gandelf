const config = require('../configuration')
const azure = require('azure-storage')

function initialise() {
    const init = !!config.AzureConnectionString
    const queueSvc = init
        ? azure.createQueueService()
        : undefined
    if (init) {
        console.log('Enabling Azure Message Queue adapter')
        console.log(`Creating Queue ${QueueName}`)
        queueSvc.createQueueIfNotExists(QueueName, (error, result, response) => {
            init = !error
            if (error) { console.log(error) }
        });
    }
    return ({init, queueSvc})
}

const azureMessage = ({init, queueSvc}) => ({short_message = ''} = {}) => {
    if (!init) { return }
    if (AzureFilter && gelf.indexOf(AzureFilter) === -1) { return }
    try{
        queueSvc.createMessage(QueueName, gelf, (error, result, response) => {
            if(error) { console.log(error) }
        });
    } catch (e) {
        console.log(e)
    }
}

module.exports.message = azureMessage(initialise());