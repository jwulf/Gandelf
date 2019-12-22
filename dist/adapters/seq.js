"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const structured_log_1 = __importDefault(require("structured-log"));
const structured_log_seq_sink_1 = __importDefault(require("../lib/structured-log-seq-sink"));
const configuration_1 = __importDefault(require("../configuration"));
const chalk_1 = __importDefault(require("chalk"));
const { Seq } = configuration_1.default || {};
const { SEQ_URL, SEQ_API_KEY } = Seq || {};
function initialise() {
    const logger = SEQ_URL
        ? structured_log_1.default
            .configure()
            .writeTo(structured_log_seq_sink_1.default({
            url: SEQ_URL,
            apiKey: SEQ_API_KEY,
            compact: true
        }))
            .create()
        : undefined;
    const SeqLogging = chalk_1.default.yellow("Seq Logging: ");
    if (logger) {
        console.log(chalk_1.default.bold(SeqLogging + chalk_1.default.green("Enabled")));
        adapter({ short_message: "Seq logging is enabled", a: 1 });
    }
    else {
        console.log(chalk_1.default.bold(SeqLogging + chalk_1.default.red("Disabled")));
    }
    return { init: !!logger, logger };
}
function parseJson(str) {
    try {
        return JSON.parse(str);
    }
    catch (e) {
        return str;
    }
}
const seqMessage = ({ init, logger }) => gelf => {
    if (!init) {
        return;
    }
    var shortMessage = gelf.short_message || "<No message>";
    var fields = Object.assign({}, gelf);
    var parsed = parseJson(shortMessage);
    if (typeof parsed === "object") {
        Object.assign(fields, parsed);
        if (parsed["@mt"])
            shortMessage = parsed["@mt"];
    }
    delete fields.short_message;
    delete fields.host;
    delete fields.version;
    delete fields.timestamp;
    logger.enrich(fields).info(shortMessage);
};
const adapter = seqMessage(initialise());
exports.default = adapter;
