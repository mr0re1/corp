//* Add new user in corpus
//
// Usage : node useradd.js name passwd
//
//*


var name = process.argv[2]
  , pass = process.argv[3];

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var CollectionProvider = require('./collectionProvider').CollectionProvider
  , UserController = require('./userController').UserController



var db = new Db('corp', new Server('localhost', 27017, {auto_reconnect: true}, {}));
var user_controller = new UserController( new CollectionProvider(db, 'users'));


user_controller.userAdd(
  {name: name, pass: pass},
  function(err, res) {
    if (err) console.error(err)
    else console.log(res);
  }
)
