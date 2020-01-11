import config from "../configuration";
import chalk from "chalk";
import http from "http";

const { Websocket } = config || {};
const WSLogging = chalk.yellow("Websocket Logging: ");

const short = long => long.split(".")[0];
const getMessage = msg =>
  typeof msg === "string"
    ? msg
    : msg && msg.short_message
    ? msg.short_message
    : undefined;

function initialise() {
  const port = Websocket.port && parseInt(Websocket.port, 10);
  if (!port) {
    console.log(chalk.bold(WSLogging + chalk.red("Disabled")));
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
            div.innerHTML += JSON.stringify(message) + "\\n";
        })
    </script>
</head>
<body>
<div id="console"></div>
</body>
</html>`;

  const app = http.createServer((_, res) => {
    res.writeHead(200);
    console.log("HTTP hit");
    res.end(Websocket.console ? Buffer.from(html) : "Gandelf");
  });
  const io = require("socket.io")(app);

  app.listen(port);
  console.log(chalk.bold(WSLogging + chalk.green("Enabled on port " + port)));

  if (Websocket.console) {
    console.log(
      chalk.bold(
        WSLogging +
          chalk.green(`Console enabled on ${Websocket.console}:${port}`)
      )
    );
  } else {
    console.log(chalk.bold(WSLogging + chalk.red("Console disabled")));
  }

  io.on("connection", function(socket) {
    console.log("user connected");
    socket.emit("welcome", "welcome man");
  });

  const adapter = gelfMessage => {
    const msg = getMessage(gelfMessage);
    const name = short(gelfMessage.host);
    io.emit(name, { msg });
    io.emit("broadcast", { name: msg });
  };

  return adapter;
}

const adapter = initialise();

export default adapter;
