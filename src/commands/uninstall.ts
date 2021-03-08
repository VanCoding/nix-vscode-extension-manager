import { Command } from "@oclif/command";
import { uninstall, parseExtensionIdentifier } from "../lib";

export default class Uninstall extends Command {
  static description = "uninstall extension";

  static examples = [`$ nvem uninstall esbenp/prettier-vscode`];

  static flags = {};

  static args = [{ name: "name" }];

  async run() {
    const { args } = this.parse(Uninstall);
    await uninstall(parseExtensionIdentifier(args.name));
  }
}
