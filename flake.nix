{
  description = "A command line utility to manage vscode extensions with nix";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  inputs.npmlock2nix.url = "github:VanCoding/npmlock2nix";

  outputs = { self, nixpkgs, npmlock2nix }:
    let
      pkgs = import nixpkgs {
        system = "x86_64-linux";
      };
      package = (import npmlock2nix {inherit pkgs;}).build {
        src = ./.;
        installPhase = "mkdir $out && cp -r lib $out/lib && cp -r bin $out/bin && cp -r node_modules $out/node_modules"; # mandatory
      };
    in
      rec {
        packages.x86_64-linux.nvem = package;
        defaultPackage.x86_64 = package;
        apps.x86_64-linux.nvem = { type = "app"; program = "${package}/bin/nvem";};
        defaultApp.x86_64-linux = apps.x86_64-linux.nvem;
      };
}
