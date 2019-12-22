"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = __importDefault(require("../configuration"));
const chalk_1 = __importDefault(require("chalk"));
const { Local } = configuration_1.default || {};
const { echo } = Local || {};
const colors = [
    chalk_1.default.cyan,
    chalk_1.default.yellow,
    chalk_1.default.cyan,
    chalk_1.default.blue,
    chalk_1.default.magenta
];
const initialise = ({ containers, init }) => ({ containers, init: !!echo });
const echoFn = ({ containers, init }) => gelfMessage => {
    if (!init) {
        return;
    }
    const name = gelfMessage._container_name || "default";
    containers[name] =
        containers[name] || colors[Object.keys(containers).length % colors.length];
    const colorised = containers[name] || chalk_1.default.white;
    console.log(colorised(`[${name}] - ${gelfMessage.short_message}`));
};
const LocalJSONLogging = chalk_1.default.yellow("Local JSON Logging: ");
if (!echo) {
    console.log(chalk_1.default.bold(LocalJSONLogging + chalk_1.default.red("Disabled")));
}
else {
    console.log(chalk_1.default.bold(LocalJSONLogging + chalk_1.default.green("Enabled")));
}
const adapter = echoFn(initialise({ containers: {}, init: false }));
exports.default = adapter;
