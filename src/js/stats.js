/* @flow */

import PouchDB from "pouchdb";
import UAParser from "ua-parser-js";
import { MY_POUCHDB, LOCAL_POUCHDB } from "./config";

// Creation des liens vers les bases.
const db = new PouchDB(MY_POUCHDB, {
  ajax: {
    timeout: 100000
  }
});

const localdb: PouchDB<any> = new PouchDB((LOCAL_POUCHDB: string));
let retry: number = 3;
const RETRY_MAX: number = 3;
const TIMEOUT: number = 1e4; // 1sec

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
  const parser: UAParser = new UAParser();
  return parser.getResult();
}

function genericPost(post: {
  _id?: string,
  date: number,
  element: any,
  type: string,
  userId: string,
  element: any
}): void {
  db
    .post(post)
    .then(function(r): void {
      // what to do???
      retry = RETRY_MAX;
      return r;
    })
    .catch(err => {
      if (err.status === 502 && retry > 0) {
        setTimeout(() => {
          retry -= 1;
          genericPost(post);
        }, TIMEOUT);
      } else {
        console.log(err);
      }
    });
}

function getUserID(callback: any) {
  /*
  On récupère l'ID en localdb.
  Sinon, on récupère les infos du browser et en envoie sur 'db'
  et on récup l'ID.
  On le stock dans localdb.
  */
  const date = new Date();
  let info: string;
  localdb
    .get("cad-killer_user")
    .then(d => {
      const doc = d;
      if (doc.userId === null) {
        // Hack , sometimes IE forget userId :(
        localdb.destroy().then(() => {
          doc.userId = getUserID();
        });
      }
      // console.log(`Hello ${doc.userId} !`);
      callback(doc.userId);
    })
    .catch(err => {
      let post: {
        _id?: string,
        date?: number,
        info?: any,
        type?: string,
        userId: string
      } = {
        userId: "badUserID"
      };
      switch (err.status) {
        case 404:
          console.log("New user! Great!");
          info = getBrowserInfo();
          post = {
            info,
            date: date.getTime(),
            type: "user",
            userId: "badUserID"
          };
          db
            .post(post)
            .then(ret => {
              const localpost = post;
              localpost.userId = ret.id;
              localpost._id = "cad-killer_user";
              localdb
                .put(localpost)
                .then(() => {
                  console.log(`Nice! Hello No. ${localpost.userId} !`);
                  callback(localpost.userId);
                })
                .catch(errputlocal => {
                  console.error(errputlocal);
                });
            })
            .catch(errpost => {
              if (err.status === 502) {
                setTimeout(() => {
                  getUserID(callback);
                }, TIMEOUT);
              } else {
                console.error(errpost);
              }
            });
          break;

        default:
          console.error(err);
      }
    });
}

function checkUserId() {
  getUserID(userId => {
    db
      .get(userId)
      .then(() => {
        console.log(`Ok ${userId} is on DB!`);
      })
      .catch(err => {
        const date = new Date();
        let info;
        let post: {
          _id?: string,
          date?: number,
          info?: any,
          type?: string,
          userId?: string
        } = {
          userId: "badID"
        };
        if (err.status === 404) {
          console.error("Damn! 404!");
          info = getBrowserInfo();
          post = {
            _id: userId,
            info,
            date: date.getTime(),
            type: "user"
          };
          db
            .put(post)
            .then(() => {
              console.log(`User ${userId} have been reposted!`);
            })
            .catch(error => {
              console.error(error);
            });
        }
        console.error(err);
      });
  });
}

export function dbinfo(): void {
  db
    .info()
    .then(result => {
      console.log(result);
      retry = RETRY_MAX;
      checkUserId();

      // handle result
    })
    .catch(err => {
      if (err.status === 502 && retry > 0) {
        setTimeout(() => {
          retry -= 1;
          dbinfo();
        }, TIMEOUT);
      } else {
        console.error(err);
      }
    });
}

function send(type: string, element?: any) {
  const date = new Date();
  let ret;
  // console.log(`Send type : ${type}`);
  getUserID(userId => {
    const post: {
      _id?: string,
      date: number,
      info?: any,
      type: string,
      userId: string,
      element?: any
    } = {
      userId,
      date: date.getTime(),
      type,
      element
    };
    if (element !== null) {
      post.element = element;
    }
    ret = genericPost(post);
  });
  return ret;
}

export function sendSearch(search?: any) {
  return send("search", search);
}

export function sendLayer(search?: any) {
  return send("layer", search);
}

export function sendNote(note?: any) {
  return send("note", note);
}

export function sendMove(move?: any) {
  return send("move", move);
}

export function sendClick(click?: any) {
  return send("click", click);
}

export function sendView() {
  return send("view", null);
}

export default function() {
  dbinfo();
}

// sendView(); // Send view on load ^^
