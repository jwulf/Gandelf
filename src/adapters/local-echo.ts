import config from "../configuration";
import chalk from "chalk";

const { Local } = config || {};
const { echo } = Local || {};

const colors = [
  chalk.cyan,
  chalk.yellow,
  chalk.cyan,
  chalk.blue,
  chalk.magenta
];

const initialise = ({ containers, init }) => ({ containers, init: !!echo });

const echoFn = ({ containers, init }) => gelfMessage => {
  if (!init) {
    return;
  }
  const name = gelfMessage._container_name || "default";
  containers[name] =
    containers[name] || colors[Object.keys(containers).length % colors.length];
  const colorised = containers[name] || chalk.white;
  console.log(colorised(`[${name}] - ${gelfMessage.short_message}`));
};

const LocalJSONLogging = chalk.yellow("Local JSON Logging: ");
if (!echo) {
  console.log(chalk.bold(LocalJSONLogging + chalk.red("Disabled")));
} else {
  console.log(chalk.bold(LocalJSONLogging + chalk.green("Enabled")));
}

const adapter = echoFn(initialise({ containers: {}, init: false }));

export default adapter;
