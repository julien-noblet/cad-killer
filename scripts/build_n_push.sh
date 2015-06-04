#!/usr/bin/bash

# Force clean
rm -rf ~/.npm
rm -rf node_modules
rm -rf bower_components
rm -rf serve
rm -rf prod

npm install
npm install -g bower gulp
bower install
gulp prod
gulp prod # run twice :)
( cd prod ;
  git init ;
  git config user.name "Travis-CI" ;
  git config user.email "travis" ;
  git add . ;
  git commit -m "Deploy to GitHub Pages" ;
  git push --force --quiet "https://${user}:${password}@github.com/julien-noblet/cad-killer.git" master:gh-pages
)
#> /dev/null 2>&1
