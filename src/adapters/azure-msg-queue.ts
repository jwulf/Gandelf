import config from "../configuration";
import azure from "azure-storage";
import chalk from "chalk";

const { Azure } = config;
const { AzureConnectionString, AzureFilter, QueueName } = Azure || {};

function initialise() {
  let init = !!AzureConnectionString;
  const queueSvc = init ? azure.createQueueService() : undefined;
  const AzureMessageQueue = chalk.yellow("Azure Message Queue Logging: ");
  if (init && QueueName) {
    console.log(chalk.bold(AzureMessageQueue + chalk.green("Enabled")));
    console.log(`Creating Queue ${QueueName}`);
    queueSvc?.createQueueIfNotExists(QueueName, (error, result, response) => {
      init = !error;
      if (error) {
        console.log(error);
      }
    });
  } else {
    console.log(chalk.bold(AzureMessageQueue + chalk.red("Disabled")));
  }
  return { init, queueSvc };
}

const azureMessage = ({
  init,
  queueSvc
}: {
  init: boolean;
  queueSvc: azure.QueueService | undefined;
}) => ({ short_message = "" } = {}) => {
  if (!init) {
    return;
  }
  if (AzureFilter && short_message.indexOf(AzureFilter) === -1) {
    return;
  }
  try {
    if (queueSvc && QueueName) {
      queueSvc.createMessage(
        QueueName,
        short_message,
        (error, result, response) => {
          if (error) {
            console.log(error);
          }
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
};

const adapter = azureMessage(initialise());

export default adapter;
