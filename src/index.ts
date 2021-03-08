import { createCommand, parse } from "commander";
import {
  init,
  install,
  updateAll,
  uninstall,
  detect,
  parseExtensionIdentifier,
} from "./lib";

const program = createCommand();

program.version("1.0.0");
program
  .command("init")
  .description("create new vscode-extensions.json file")
  .action(async () => {
    await init();
  });

program
  .command("detect <extensions-dir>")
  .description("create vscode-extensions.json from existing extensions-dir")
  .action(async (dir) => {
    await detect(dir);
  });

program
  .command("install <extension>")
  .description("install new extension")
  .action(async (extensionIdentifer) => {
    await install(parseExtensionIdentifier(extensionIdentifer));
  });

program
  .command("update [extension]")
  .description("update single or all extensions")
  .action(async (extensionIdentifer) => {
    if (extensionIdentifer) {
      await install(parseExtensionIdentifier(extensionIdentifer));
    } else {
      await updateAll();
    }
  });

program
  .command("uninstall <extension>")
  .description("install new extension")
  .action(async (extensionIdentifer) => {
    await uninstall(parseExtensionIdentifier(extensionIdentifer));
  });

program.parse(process.argv);
