import { Command } from "@oclif/command";
import { update, updateAll, parseExtensionIdentifier } from "../lib";

export default class Update extends Command {
  static description = "update extension to newest version";

  static examples = [`$ nvem update esbenp/prettier-vscode`];

  static flags = {};

  static args = [{ name: "name" }];

  async run() {
    const { args } = this.parse(Update);
    if (args.name) {
      await update(parseExtensionIdentifier(args.name));
    } else {
      await updateAll();
    }
  }
}
