import chalk from "chalk";
import slack from "./adapters/slack";
import seq from "./adapters/seq";
import azure from "./adapters/azure-msg-queue";
import local from "./adapters/local-echo";
import healthcheck from "./adapters/healthchecks.io";

import uncaught from "uncaught";

import GelfServer from "@magikcraft/graygelf/server";
import gelfForward from "./adapters/gelf-forward";

console.log(chalk.bold(chalk.cyan("~~ Gandelf logging container ~~\n")));

const gelfServer = GelfServer();
gelfServer.listen(12201);

gelfForward(gelfServer);

healthcheck();

uncaught.start();
uncaught.addListener(error =>
  console.log("Uncaught error or rejection: ", error.message)
);

const adapters = [azure, local, seq, slack];

gelfServer.on("message", gelfMessage => {
  // tslint:disable-next-line: no-console
  console.log("message", gelfMessage); // @DEBUG
  adapters.forEach(adapter => adapter(gelfMessage));
});

console.log(
  chalk.bold(chalk.cyan("\n~~ Gandelf is listening on Port 12201 ~~"))
);
