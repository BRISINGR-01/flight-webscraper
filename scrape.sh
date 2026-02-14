#! /bin/bash

cd "$(dirname "$0")"
cd ./webscraper
nix-shell --run "bun run script.ts"