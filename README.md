# nix-vscode-extension-manager

A CLI to manage VSCode extensions on NixOS or within a nix-shell

## Installation

You can run the app without installing it. Just run `nix run github:vancoding/nix-vscode-extension-manager`

If you still want to install it, it's a flake! It's easy as a cake.

## Getting Started

- `nvem init`
- `nvem detect [path to your extensions directory]`

Then add the following between your environment.systemPackages list:

```
(vscode-with-extensions.override {
  vscodeExtensions = vscode-utils.extensionsFromVscodeMarketplace (builtins.fromJSON (builtins.readFile ./vscode-extensions.json));
})
```

## Usage

```
Usage: nvem [options] [command]

Options:
  -V, --version            output the version number
  -h, --help               display help for command

Commands:
  init                     create new vscode-extensions.json file
  detect <extensions-dir>  create vscode-extensions.json from existing extensions-dir
  install <extension>      install new extension
  update <extension>       update extension
  update                   update all extensions
  uninstall <extension>    install new extension
  help [command]           display help for command
```
