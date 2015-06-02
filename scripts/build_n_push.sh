#!/usr/bin/bash

npm install
bower install
gulp prod
gulp prod
cd prod
git config user.name "Travis-CI"
git config user.email "travis"
git add .
git commit -m "Deploy to GitHub Pages"
git push --force --quiet "https://${user}:${password}@github.com/julien-noblet/cad-killer.git" master:gh-pages 
#> /dev/null 2>&1
