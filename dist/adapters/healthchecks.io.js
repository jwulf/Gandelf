"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = __importDefault(require("../configuration"));
const chalk_1 = __importDefault(require("chalk"));
const healthchecks_io_1 = __importDefault(require("healthchecks.io"));
const { Healthchecksio } = configuration_1.default;
const { heartbeat, url } = Healthchecksio || {};
function startHeartbeat() {
    const Heartbeat = chalk_1.default.yellow("Healthchecks.io heartbeat: ");
    if (url) {
        console.log(chalk_1.default.bold(Heartbeat + chalk_1.default.green(`Enabled - ${heartbeat} mins`)));
        healthchecks_io_1.default(url, heartbeat);
    }
    else {
        console.log(chalk_1.default.bold(Heartbeat + chalk_1.default.red("Disabled")));
    }
}
exports.default = startHeartbeat;
