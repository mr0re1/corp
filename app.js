var express = require('express')
  , util = require('util')
  , http = require('http')
  , async = require('async');


var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var CollectionProvider = require('./collectionProvider').CollectionProvider
  , UserController = require('./userController').UserController
  , LexemeController = require('./lexemeController').LexemeController
  , DocumentController = require('./documentController').DocumentController
  , PersonController = require('./personController').PersonController;

app = express();

var db = new Db('corp', new Server('localhost', 27017, {auto_reconnect: true}, {}));

app.user_controller = new UserController( new CollectionProvider(db, 'users'));
app.lexeme_controller = new LexemeController(new CollectionProvider(db, 'lex'));
app.document_controller = new DocumentController(new CollectionProvider(db, 'docs'), app.lexeme_controller);
app.person_controller = new PersonController(new CollectionProvider(db, 'persons'));

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

/*
var uploadFile = function(to, req, res, next) {
  var file = to + req.params.id;
  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.on('data', function(chunk) { res.write(chunk); });
  filestream.on('end', function() { res.end(); });
};

app.get('/audio/:id', uploadFile.bind(null, __dirname + '/data/audio/'));
app.get('/photo/:id', uploadFile.bind(null, __dirname + '/data/photo/'));
*/



