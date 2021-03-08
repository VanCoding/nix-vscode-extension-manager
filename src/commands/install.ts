import { Command, flags } from "@oclif/command";
import { install, parseExtensionIdentifier } from "../lib";

export default class Install extends Command {
  static description = "install new extension";

  static examples = [`$ nvem install esbenp/prettier-vscode`];

  static flags = {};

  static args = [{ name: "name" }];

  async run() {
    const { args } = this.parse(Install);
    await install(parseExtensionIdentifier(args.name));
  }
}
