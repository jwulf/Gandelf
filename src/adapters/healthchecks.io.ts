import config from "../configuration";
import chalk from "chalk";
import healthcheck from "healthchecks.io";

const { Healthchecksio } = config;
const { heartbeat, url } = Healthchecksio || {};

function startHeartbeat() {
  const Heartbeat = chalk.yellow("Healthchecks.io heartbeat: ");
  if (url) {
    console.log(
      chalk.bold(Heartbeat + chalk.green(`Enabled - ${heartbeat} mins`))
    );
    healthcheck(url, heartbeat);
  } else {
    console.log(chalk.bold(Heartbeat + chalk.red("Disabled")));
  }
}

export default startHeartbeat;
