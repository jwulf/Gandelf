const AzureConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const QueueName = process.env.AZURE_STORAGE_QUEUE_NAME || '';
let init = false;

if (AzureConnectionString) { init = true; }

const azure = require('azure-storage');

if (init) {
    const queueSvc = azure.createQueueService();
    console.log(`Creating Queue ${QueueName}`);
    queueSvc.createQueueIfNotExists(QueueName, (error, result, response) => {
        init = !error
        if (error) { console.log(error); }
    });
}

function azureMessage(msg) {
    if (!init) { return; }
    queueSvc.createMessage(QueueName, msg, (error, result, response) => {
        if(error) { console.log(error); }
    });
}

module.exports.azureMsg = azureMessage;