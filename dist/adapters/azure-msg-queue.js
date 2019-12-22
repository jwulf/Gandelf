"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = __importDefault(require("../configuration"));
const azure_storage_1 = __importDefault(require("azure-storage"));
const chalk_1 = __importDefault(require("chalk"));
const { Azure } = configuration_1.default;
const { AzureConnectionString, AzureFilter, QueueName } = Azure || {};
function initialise() {
    var _a;
    let init = !!AzureConnectionString;
    const queueSvc = init ? azure_storage_1.default.createQueueService() : undefined;
    const AzureMessageQueue = chalk_1.default.yellow("Azure Message Queue Logging: ");
    if (init && QueueName) {
        console.log(chalk_1.default.bold(AzureMessageQueue + chalk_1.default.green("Enabled")));
        console.log(`Creating Queue ${QueueName}`);
        (_a = queueSvc) === null || _a === void 0 ? void 0 : _a.createQueueIfNotExists(QueueName, (error, result, response) => {
            init = !error;
            if (error) {
                console.log(error);
            }
        });
    }
    else {
        console.log(chalk_1.default.bold(AzureMessageQueue + chalk_1.default.red("Disabled")));
    }
    return { init, queueSvc };
}
const azureMessage = ({ init, queueSvc }) => ({ short_message = "" } = {}) => {
    if (!init) {
        return;
    }
    if (AzureFilter && short_message.indexOf(AzureFilter) === -1) {
        return;
    }
    try {
        if (queueSvc && QueueName) {
            queueSvc.createMessage(QueueName, short_message, (error, result, response) => {
                if (error) {
                    console.log(error);
                }
            });
        }
    }
    catch (e) {
        console.log(e);
    }
};
const adapter = azureMessage(initialise());
exports.default = adapter;
