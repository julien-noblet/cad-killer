#!/usr/bin/bash

 cd prod ;
  git init ;
  git config user.name "Travis-CI" ;
  git config user.email "travis" ;
  git add . ;
  echo "Branche : ${TRAVIS_BRANCH}" ;
  echo "PR : ${TRAVIS_PULL_REQUEST}" ;
  git commit -m "Deploy ${TRAVIS_BRANCH} to GitHub Pages" ;
  if [ ${TRAVIS_BRANCH} == "master" ] 
    then 
      echo "Push to julien-noblet/cad-killer";
      git push --force --quiet "https://${user}:${password}@github.com/julien-noblet/cad-killer.git" master:gh-pages;
    else 
      echo "Push to julien-noblet/cad-killer-beta";
      git push --force --quiet "https://${user}:${password}@github.com/julien-noblet/cad-killer-beta.git" master:gh-pages
  fi

#> /dev/null 2>&1
