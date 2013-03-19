var express = require('express')
  , util = require('util')
  , http = require('http')
  , async = require('async')
  , fs = require('fs')
  , Buffer = require('buffer').Buffer
  , Iconv = require('iconv').Iconv;


var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var CollectionProvider = require('./collectionProvider').CollectionProvider
  , UserController = require('./userController').UserController
  , LexemeController = require('./lexemeController').LexemeController
  , DocumentController = require('./documentController').DocumentController
  , PersonController = require('./personController').PersonController
  , FileManager = require('./fileManager').FileManager;

app = express();

var db = new Db('corp', new Server('localhost', 27017, {auto_reconnect: true}, {}));

app.file_manager = new FileManager({
  "app_key": "ly7wj2y5woa6hxp",
  "app_secret": "2oez04swwobjik9",
  "oauth_token": "0s38odstrtwfn46",
  "oauth_token_secret": "z1gsizc6xik3ppd",
  "uid": "23698457",
  routes: [ '/photo', '/audio' ],
});
app.user_controller = new UserController( new CollectionProvider(db, 'users'));
app.lexeme_controller = new LexemeController(new CollectionProvider(db, 'lex'));
app.document_controller = new DocumentController(new CollectionProvider(db, 'docs'), app.lexeme_controller, app.file_manager);
app.person_controller = new PersonController(new CollectionProvider(db, 'persons'), app.file_manager);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.favicon());
  app.use(express.limit('100mb'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir:'./uploads'}));
  app.use(express.methodOverride());

  app.use(express.cookieParser());
  app.use(express.session({ secret: 'secret_string_for_compute_hash' }));
  
  app.use(app.file_manager.middleware.bind(app.file_manager));
  app.use(express.static(__dirname + '/public'));
  
  

  require('./auth')(app);
  require('./assets')(app);
 
  app.use(app.router);
  
  require('./routes')(app);  
  require('./permissions')(app);

  app.locals.dateFormat = function() { return 'xxx' };

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

db.open(function(err) {
  if (err) throw err;
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
})

app.all('/returnfilecontent', function(req, res, next) {
  if(! req.files || ! req.files.file) next(new Error("No file!"));
  else {
    try {
      var conv = new Iconv(req.body.encoding || 'UTF-8', 'UTF-8');
      fs.readFile(req.files.file.path, function(err, data){
        if (err) next(err);
        else {
          try {
            res.type('text');
            res.send( conv.convert(data) );
          }
          catch (e) { next(e) }
        }
      });
    } catch (e) { next(e) }
  }
});




