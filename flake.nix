{
  description = "A command line utility to manage vscode extensions with nix";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      pkgs = import nixpkgs {
        system = "x86_64-linux";
      };
      npmlock2nixSource = pkgs.fetchFromGitHub {
        owner = "tweag";
        repo = "npmlock2nix";
        rev = "7a321e2477d1f97167847086400a7a4d75b8faf8";
        sha256 = "10igdxcc6scf6hksjbbgpj877f6ry8mipz97r2v8j718wd233v6a";
      };
      npmlock2nix = import npmlock2nixSource {inherit pkgs;};
      package = npmlock2nix.build {
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
