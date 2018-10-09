#!/bin/sh
git clone git@github.com:julien-noblet/cad-killer.git
cd cad-killer
git checkout $TRAVIS_BRANCH

rm -rf dist flow-typed/npm yarn.lock package-lock.json node_modules
npm install
npm audit fix
rm -rf node_modules
yarn
flow-typed update
git add yarn.lock package-lock.json flow-typed
git commit -m "chore(package): update lockfiles yarn.lock & package-lock.json + update flow-typed files"
git push
cd ..
rm -rf cad-killer
