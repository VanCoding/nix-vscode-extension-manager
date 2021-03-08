import { createCommand, parse } from "commander";
import {
  init,
  install,
  update,
  updateAll,
  uninstall,
  parseExtensionIdentifier,
} from "./lib";

const program = createCommand();

program.version("1.0.0");
program
  .command("init")
  .description("create new vscode-extensions.json file")
  .action(async (env, options) => {
    await init();
  });

program
  .command("install <extension>")
  .description("install new extension")
  .action(async (extensionIdentifer) => {
    await install(parseExtensionIdentifier(extensionIdentifer));
  });

program
  .command("update <extension>")
  .description("update extension")
  .action(async (extensionIdentifer) => {
    await update(parseExtensionIdentifier(extensionIdentifer));
  });

program
  .command("update")
  .description("update all extensions")
  .action(async (extensionIdentifer) => {
    await updateAll();
  });

program
  .command("uninstall <extension>")
  .description("install new extension")
  .action(async (extensionIdentifer) => {
    await uninstall(parseExtensionIdentifier(extensionIdentifer));
  });

program.parse(process.argv);
