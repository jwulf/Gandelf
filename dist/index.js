"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const slack_1 = __importDefault(require("./adapters/slack"));
const seq_1 = __importDefault(require("./adapters/seq"));
const azure_msg_queue_1 = __importDefault(require("./adapters/azure-msg-queue"));
const local_echo_1 = __importDefault(require("./adapters/local-echo"));
const healthchecks_io_1 = __importDefault(require("./adapters/healthchecks.io"));
const uncaught_1 = __importDefault(require("uncaught"));
const server_1 = __importDefault(require("@magikcraft/graygelf/server"));
const gelf_forward_1 = __importDefault(require("./adapters/gelf-forward"));
console.log(chalk_1.default.bold(chalk_1.default.cyan("~~ Gandelf logging container ~~\n")));
const gelfServer = server_1.default();
gelf_forward_1.default(gelfServer);
gelfServer.listen();
healthchecks_io_1.default();
uncaught_1.default.start();
uncaught_1.default.addListener(error => console.log("Uncaught error or rejection: ", error.message));
const adapters = [azure_msg_queue_1.default, local_echo_1.default, seq_1.default, slack_1.default];
gelfServer.on("message", gelfMessage => {
    // tslint:disable-next-line: no-console
    console.log("message", gelfMessage); // @DEBUG
    adapters.forEach(adapter => adapter(gelfMessage));
});
gelfServer.listen(12201);
console.log(chalk_1.default.bold(chalk_1.default.cyan("\n~~ Gandelf is listening on Port 12201 ~~")));
