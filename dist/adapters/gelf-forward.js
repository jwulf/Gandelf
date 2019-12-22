"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graygelf_1 = __importDefault(require("@magikcraft/graygelf"));
const configuration_1 = __importDefault(require("../configuration"));
const chalk_1 = __importDefault(require("chalk"));
const { Gelf } = configuration_1.default || {};
const { url } = Gelf || {};
function initialise() {
    const GelfForwarding = chalk_1.default.yellow("Gelf forwarding: ");
    try {
        if (url) {
            console.log(chalk_1.default.bold(GelfForwarding + chalk_1.default.green("Enabled")));
            return graygelf_1.default(url);
        }
    }
    catch (e) {
        console.log(e);
    }
    console.log(chalk_1.default.bold(GelfForwarding + chalk_1.default.red("Disabled")));
    return undefined;
}
const forward = client => server => client && server.pipe(client);
const adapter = forward(initialise());
exports.default = adapter;
