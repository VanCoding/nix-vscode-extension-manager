{
  description = "A command line utility to manage vscode extensions with nix";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  inputs.npmlock2nix.url = "github:VanCoding/npmlock2nix";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, npmlock2nix, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
        package = (import npmlock2nix {inherit pkgs;}).build {
          src = ./.;
          installPhase = "mkdir $out && cp -r lib $out/lib && cp -r bin $out/bin && cp -r node_modules $out/node_modules"; # mandatory
        };
      in
        rec {
          packages.nvem = package;
          defaultPackage = package;
          apps.nvem = { type = "app"; program = "${package}/bin/nvem";};
          defaultApp= apps.nvem;
        }
    );
}
