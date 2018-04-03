const config = require('../configuration')
const azure = require('azure-storage')
const chalk = require('chalk')

function initialise() {
    const init = !!config.AzureConnectionString
    const queueSvc = init
        ? azure.createQueueService()
        : undefined
    const AzureMessageQueue = chalk.yellow('Azure Message Queue Logging: ')
    if (init) {
        console.log(chalk.bold(AzureMessageQueue + chalk.green('Enabled')))
        console.log(`Creating Queue ${QueueName}`)
        queueSvc.createQueueIfNotExists(QueueName, (error, result, response) => {
            init = !error
            if (error) { console.log(error) }
        })
    } else {
        console.log(chalk.bold(AzureMessageQueue + chalk.red('Disabled')))
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

module.exports = azureMessage(initialise());