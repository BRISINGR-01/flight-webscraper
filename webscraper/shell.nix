{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = with pkgs; [ chromium stdenv.cc.cc.lib ];

  shellHook = ''
    export PUPPETEER_EXECUTABLE_PATH=$(which chromium);
    export LD_LIBRARY_PATH=${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH
  '';
}
