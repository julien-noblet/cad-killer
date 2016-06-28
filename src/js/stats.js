/* global PouchDB,
          MY_POUCHDB,
          LOCAL_POUCHDB,
          UAParser
*/

// Creation des liens vers les bases.
const db = new PouchDB(MY_POUCHDB, {
  ajax: {
    timeout: 100000
  }
});

const localdb = new PouchDB(LOCAL_POUCHDB);
let retry = 3;
const RETRY_MAX = 3;
const TIMEOUT = 1e4; // 1sec

/*
LOCAL_POUCHDB:
{
  "_id":"cad-killer_user",
  "userId" : "xxxxx-xxxxx-xxxxx-xxxxx",
  "date" : 1444208388275 //milis from Epoch,
  "info" : {...}
}
*/

function getBrowserInfo() {
  const parser = new UAParser();
  return parser.getResult();
}

function genericPost(post) {
  db.post(post).then((r) => {
    // what to do???
    retry = RETRY_MAX;
    return r;
  }).catch((err) => {
    if (err.status === 502 && retry > 0) {
      setTimeout(() => {
        retry -= 1;
        genericPost(post);
      }, TIMEOUT);
    } else {
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    }
  });
}

function getUserID(callback) {
  /*
  On récupère l'ID en localdb.
  Sinon, on récupère les infos du browser et en envoie sur 'db'
  et on récup l'ID.
  On le stock dans localdb.
  */
  const date = new Date();
  let info;
  localdb.get("cad-killer_user").then((d) => {
    const doc = d;
    if (!doc.userId) { // Hack , sometimes IE forget userId :(
      localdb.destroy().then(() => {
        doc.userId = getUserID();
      });
    }
    /* eslint-disable no-console */
    console.log("Hello ${doc.userId} !");
    /* eslint-enable no-console */
    callback(doc.userId);
  }).catch((err) => {
    let post = {};
    switch (err.status) {
      case 404:
        /* eslint-disable no-console */
        console.log("New user! Great!");
        /* eslint-enable no-console */
        info = getBrowserInfo();
        post = {
          info,
          date: date.getTime(),
          type: "user"
        };
        db.post(post).then((ret) => {
          const localpost = post;
          localpost.userId = ret.id;
          localpost._id = "cad-killer_user";
          localdb.put(localpost).then(() => {
            /* eslint-disable no-console */
            console.log("Nice! Hello No. ${localpost.userId} !");
            /* eslint-enable no-console */
            callback(localpost.userId);
          }).catch((errputlocal) => {
            /* eslint-disable no-console */
            console.error(errputlocal);
            /* eslint-enable no-console */
          });
        }).catch((errpost) => {
          if (err.status === 502) {
            setTimeout(() => {
              getUserID(callback);
            }, TIMEOUT);
          } else {
            /* eslint-disable no-console */
            console.error(errpost);
            /* eslint-enable no-console */
          }
        });
        break;
      default:
        /* eslint-disable no-console */
        console.error(err);
        /* eslint-enable no-console */
    }
  });
}

function checkUserId() {
  getUserID((userId) => {
    db.get(userId).then(() => {
      /* eslint-disable no-console */
      console.log("Ok ${userId} is on DB!");
      /* eslint-enable no-console */

    }).catch((err) => {
      const date = new Date();
      let info;
      let post;
      if (err.status === 404) {
        /* eslint-disable no-console */
        console.error("Damn! 404!");
        /* eslint-enable no-console */
        info = getBrowserInfo();
        post = {
          _id: userId,
          info,
          date: date.getTime(),
          type: "user"
        };
        db.put(post).then(() => {
          /* eslint-disable no-console */
          console.log("User ${userId} have been reposted!");
          /* eslint-enable no-console */
        }).catch((error) => {
          /* eslint-disable no-console */
          console.error(error);
          /* eslint-enable no-console */
        });
      }
      /* eslint-disable no-console */
      console.error(err);
      /* eslint-enable no-console */
    });
  });
}

function dbinfo() {
  db.info().then((result) => {
    /* eslint-disable no-console */
    console.log(result);
    /* eslint-enable no-console */
    retry = RETRY_MAX;
    checkUserId();
    // handle result
  }).catch((err) => {
    if (err.status === 502 && retry > 0) {
      setTimeout(() => {
        retry -= 1;
        dbinfo();
      }, TIMEOUT);
    } else {
      /* eslint-disable no-console */
      console.error(err);
      /* eslint-enable no-console */
    }
  });
}

function send(type, element) {
  const date = new Date();
  let ret;
  /* eslint-disable no-console */
  console.log("Send type : ${type}");
  /* eslint-enable no-console */
  getUserID((userId) => {
    const post = {
      userId,
      date: date.getTime(),
      type
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

dbinfo();
sendView(); // Send view on load ^^
