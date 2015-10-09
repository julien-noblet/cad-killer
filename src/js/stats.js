/* global PouchDB,
          MY_POUCHDB,
          LOCAL_POUCHDB,
          UAParser
*/
"use strict";

// Creation des liens vers les bases.
var db = new PouchDB(MY_POUCHDB, {
    ajax: {
      timeout: 100000
    }
  }),
  localdb = new PouchDB(LOCAL_POUCHDB);

/*
LOCAL_POUCHDB:
{
  "_id":"cad-killer_user",
  "userId" : "xxxxx-xxxxx-xxxxx-xxxxx",
  "date" : 1444208388275 //milis from Epoch,
  "info" : {...}
}
*/

db.info().then(function(result) {
  /* eslint-disable no-console */
  console.log(result);
  /* eslint-enable no-console */
  // handle result
}).catch(function(err) {
  /* eslint-disable no-console */
  console.log(err);
  /* eslint-enable no-console */
});

function getBrowserInfo() {
  var parser = new UAParser();
  return parser.getResult();
}

function genericPost(post) {
  db.post(post).then(function(r) {
    // what to do???
    return r;
  }).catch(function(err) {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable no-console */
    return err;
  });
}

function getUserID(callback) {
  /*
  On récupère l'ID en localdb.
  Sinon, on récupère les infos du browser et en envoie sur 'db'
  et on récup l'ID.
  On le stock dans localdb.
  */
  var date = new Date(),
    info;
  localdb.get("cad-killer_user").then(function(doc) {
    /* eslint-disable no-console */
    console.log("Hello " + doc.userId + "!");
    /* eslint-enable no-console */
    callback(doc.userId);
  }).catch(function(err) {
    var post = {};
    if (err.status === 404) {
      /* eslint-disable no-console */
      console.log("New user! Great!");
      /* eslint-enable no-console */
      info = getBrowserInfo();
      post = {
        info: info,
        date: date.getTime(),
        type: "user"
      };
      db.post(post).then(function(ret) {
        var localpost = post;
        localpost.userId = ret.id;
        localpost._id = "cad-killer_user";
        localdb.put(localpost).then(function() {
          /* eslint-disable no-console */
          console.log("Nice! Hello No. " + localpost.userId + " !");
          /* eslint-enable no-console */
          callback(localpost.userId);
        }).catch(function(errputlocal) {
          /* eslint-disable no-console */
          console.log(errputlocal);
          /* eslint-enable no-console */
        });
      }).catch(function(errpost) {
        /* eslint-disable no-console */
        console.log(errpost);
        /* eslint-enable no-console */
      });
    } else {
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    }
  });
}

function send(type, element) {
  var date = new Date(),
    ret;
  /* eslint-disable no-console */
  console.log("Send type : " + type);
  /* eslint-enable no-console */
  getUserID(function(myUserId) {
    var post = {
      userId: myUserId,
      date: date.getTime(),
      type: type
    };
    if (element !== null) {
      post.element = element;
    }
    ret = genericPost(post);
  });
  return ret;
}

/* eslint-disable no-unused-vars */
function sendSearch(search) {
  return send("search", search);
}
/* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars */
function sendLayer(search) {
  return send("layer", search);
}
/* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars */
function sendNote(note) {
  return send("note", note);
}
/* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars */
function sendMove(move) {
  return send("move", move);
}
/* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars */
function sendClick(click) {
  return send("click", click);
}
/* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars */
function sendView() {
  return send("view", null);
}

sendView(); // Send view on load ^^
