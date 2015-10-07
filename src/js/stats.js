// Creation des liens vers les bases.
var db = new PouchDB(MY_POUCHDB, {
  ajax: {
    timeout: 100000
  }
});
var localdb = new PouchDB(LOCAL_POUCHDB);

/*
LOCAL_POUCHDB:
{
  "_id":"cad-killer_user",
  "user_id" : "xxxxx-xxxxx-xxxxx-xxxxx",
  "date" : 1444208388275 //milis from Epoch
}
*/
db.info().then(function(result) {
  // handle result
}).catch(function(err) {
  console.log(err);
});

function getInfo() {
  var parser = new UAParser();
  return parser.getResult();
}

function sendNewSearch(search){
  var ret;
  var post = {
    "user_id": getUserID(),
    "date": date.getTime(),
    "search": search,
    "type":"search"
  };
  return genericPost(post);
}

function sendNewNote(note){
  var ret;
  var post = {
    "user_id": getUserID(),
    "date": date.getTime(),
    "note": note,
    "type":"note"
  };
  return genericPost(post);
}

function sendMove(move){
  var ret;
  var post = {
    "user_id": getUserID(),
    "date": date.getTime(),
    "move": move,
    "type":"move"
  };
  return genericPost(post);
}

function sendClick(click){
  var ret;
  var post = {
    "user_id": getUserID(),
    "date": date.getTime(),
    "element": click,
    "type":"click"
  };
  return genericPost(post);
}

function sendView() {
  var ret;
  var post = {
    "user_id": getUserID(),
    "date": date.getTime(),
    "type":"view"
  };
  return genericPost(post);
}
function genericPost(post){
  var ret;
  db.post(post).then(function(r){
    ret = r;
    // what to do???
  }).catch(function(err){
    console.log(err)
  });
  return ret;
}
function getUserID() {
  /*
  On récupère l'ID en localdb.
  Sinon, on récupère les infos du browser et en envoie sur 'db'
  et on récup l'ID.
  On le stock dans localdb.
  */
  var info;
  var date = new Date();
  localdb.get("cad-killer_user").then(function(doc) {
    var post = {};
    console.log(doc);
    console.log("Hello " + doc.user_id + "!");
    return doc.user_id;
  }).catch(function(err) {
    var post = {};
    if (err["status"] == 404) {
      console.log('New user! Great!');
      info = getInfo();
      post = {
        "info": info,
        "date": date.getTime(),
        "type": 'user'
      }
      db.post(post).then(function(ret) {
        console.log(ret)
        post.user_id = ret.id;
        post._id = "cad-killer_user";
        localdb.put(post).then(function() {
          console.log("Nice! Hello No. " + post.user_id + " !");
        }).catch(function() {
          console.log(err);
        });
      }).catch(function(err) {
        console.log(err);
      });
    }


  });
}
