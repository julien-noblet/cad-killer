#!/usr/bin/bash

gulp prod
sleep 1
gulp prod # run twice :)
sleep 1
( cd prod ;
  git init ;
  git config user.name "Travis-CI" ;
  git config user.email "travis" ;
  git add . ;
  echo "Branche : ${TRAVIS_BRANCH}" ;
  git commit -m "Deploy ${TRAVIS_BRANCH} to GitHub Pages" ;
  if ${TRAVIS_BRANCH} == "master"
    then git push --force --quiet "https://${user}:${password}@github.com/julien-noblet/cad-killer.git" master:gh-pages
    else git push --force --quiet "https://${user}:${password}@github.com/julien-noblet/cad-killer-beta.git" master:gh-pages
  fi
)
#> /dev/null 2>&1
