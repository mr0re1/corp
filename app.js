
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http');

var UserProvider = require('./providers/user').UserProvider
  , userProvider = new UserProvider('localhost', 27017, function(err, provider){});
var Auth = require('./auth').Auth
  , auth = new Auth({ provider: userProvider });

var DocumentController = require('./documentController')
  , docuemntController = new DocumentController('localhost', 27017, function(err, provider){});

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'secret_string_for_compute_hash' }));
  
  app.use(auth.middleware);
  
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/', routes.index);
app.post('/login', function(req, res, next){ auth.login(req, res, next); }, function(req, res) { res.redirect('back'); } );
app.all('/logout', function(req, res, next){ auth.logout(req, res, next); },  function(req, res) { res.redirect('back'); } );

app.get('/doc/load')
app.post('/doc/load', function(req, res, next){ documentController.load(req, res, next) } );

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
