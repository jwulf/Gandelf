const AzureConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const QueueName = process.env.AZURE_STORAGE_QUEUE_NAME || '';
let init = false;

if (AzureConnectionString) { init = true; }

const azure = require('azure-storage');
let queueSvc;

if (init) {
    queueSvc = azure.createQueueService();
    console.log(`Creating Queue ${QueueName}`);
    queueSvc.createQueueIfNotExists(QueueName, (error, result, response) => {
        init = !error
        if (error) { console.log(error); }
    });
}

const azureMessage = (msg) => {
    if (!init) { return; }
    try{
        queueSvc.createMessage(QueueName, msg, (error, result, response) => {
            if(error) { console.log(error); }
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports.azureMessage = azureMessage;