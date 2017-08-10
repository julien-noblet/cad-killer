#!/usr/bin/bash
git config user.name "Travis-CI" ;
git config user.email "travis" ;
git add yarn.lock;
git commit -m "Updating yarn.lock";
 git config --global push.default simple;
git config remote.origin.url "https://${user}:${password}@github.com/julien-noblet/cad-killer.git";
git push --quiet;
cd dist ;
  git init ;
  git config user.name "Travis-CI" ;
  git config user.email "travis" ;
  git add . ;
  echo "Branche : ${TRAVIS_BRANCH}" ;
  echo "PR : ${TRAVIS_PULL_REQUEST}" ;
  git commit -m "Deploy ${TRAVIS_BRANCH} to GitHub Pages" ;
  if [ ${TRAVIS_BRANCH} == "master" ] && [ ${TRAVIS_PULL_REQUEST} == "false" ]
    then
      echo "Push to julien-noblet/cad-killer";
      git push --force --quiet "https://${user}:${password}@github.com/julien-noblet/cad-killer.git" master:gh-pages;
    else
      echo "Push to julien-noblet/cad-killer-beta";
      git push --force --quiet "https://${user}:${password}@github.com/julien-noblet/cad-killer-beta.git" master:gh-pages
  fi

#> /dev/null 2>&1
