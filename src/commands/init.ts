import { Command } from "@oclif/command";
import { init } from "../lib";

export default class Init extends Command {
  static description = "create new vscode-extensions.json file";

  static examples = [`$ nvem init`];

  static flags = {};

  static args = [];

  async run() {
    await init();
  }
}
