#!/usr/bin/bash

# Force clean
rm -rf ~/.npm
rm -rf node_modules
rm -rf bower_components
rm -rf serve
rm -rf prod

npm install
sleep 1
npm install -g bower gulp
sleep 1
bower install
sleep 1
gulp prod
sleep 1
gulp prod # run twice :)
sleep 1
( cd prod ;
  git init ;
  git config user.name "Travis-CI" ;
  git config user.email "travis" ;
  git add . ;
  git commit -m "Deploy to GitHub Pages" ;
  if ${TRAVIS_BRANCH} == "master"
    then git push --force --quiet "https://${user}:${password}@github.com/julien-noblet/cad-killer.git" master:gh-pages
  else git push --force --quiet "https://${user}:${password}@github.com/julien-noblet/cad-killer-beta.git" master:gh-pages
  fi
)
#> /dev/null 2>&1
