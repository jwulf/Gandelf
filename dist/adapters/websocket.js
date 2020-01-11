"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = __importDefault(require("../configuration"));
const chalk_1 = __importDefault(require("chalk"));
const http_1 = __importDefault(require("http"));
const { Websocket } = configuration_1.default || {};
const WSLogging = chalk_1.default.yellow("Websocket Logging: ");
const short = long => long.split(".")[0];
const getMessage = msg => typeof msg === "string"
    ? msg
    : msg && msg.short_message
        ? msg.short_message
        : undefined;
function initialise() {
    const port = Websocket.port && parseInt(Websocket.port, 10);
    if (!port) {
        console.log(chalk_1.default.bold(WSLogging + chalk_1.default.red("Disabled")));
        return msg => msg;
    }
    const html = `<html>
<head>
    <title>Socket io client</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
    <script>
        var socket = io("${Websocket.console}:${port}");
        // use your socket
        socket.on("broadcast", (message) => {
            // do something with the message.
            var div = document.getElementById('console');
            div.innerHTML += JSON.stringify(message) + "<br/>";
        })
    </script>
</head>
<body>
<div id="console"></div>
</body>
</html>`;
    const app = http_1.default.createServer((_, res) => {
        res.writeHead(200);
        console.log("HTTP hit");
        res.end(Websocket.console ? Buffer.from(html) : "Gandelf");
    });
    const io = require("socket.io")(app);
    app.listen(port);
    console.log(chalk_1.default.bold(WSLogging + chalk_1.default.green("Enabled on port " + port)));
    if (Websocket.console) {
        console.log(chalk_1.default.bold(WSLogging +
            chalk_1.default.green(`Console enabled on ${Websocket.console}:${port}`)));
    }
    else {
        console.log(chalk_1.default.bold(WSLogging + chalk_1.default.red("Console disabled")));
    }
    io.on("connection", function (socket) {
        console.log("user connected");
        socket.emit("welcome", "welcome man");
    });
    const adapter = gelfMessage => {
        const msg = getMessage(gelfMessage);
        const name = short(gelfMessage.host);
        io.emit(name, { msg });
        io.emit("broadcast", { [name]: msg });
    };
    return adapter;
}
const adapter = initialise();
exports.default = adapter;
