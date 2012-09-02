/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , path = require('path')
  , mime = require('mime')
  , fs = require('fs')
  , util = require('util')
  , http = require('http');


// TODO: use config for host port and collections names
var CollectionProvider = require('./collectionProvider').CollectionProvider;

var UserController = require('./userController').UserController
  , uc = new UserController(new CollectionProvider('localhost', 27017, 'corp', 'users'));
var Auth = require('./auth').Auth
  , auth = new Auth({ provider: uc });

var DocumentController = require('./documentController').DocumentController
  , dc = new DocumentController(new CollectionProvider('localhost', 27017, 'corp', 'docs'));
  
var PersonController = require('./personController').PersonController
  , pc = new PersonController(new CollectionProvider('localhost', 27017, 'corp', 'persons'));

var app = express();

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
  
  app.use(auth.middleware);
  
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
  //Error handling
  app.use(function(err, req, res, next){
    if (! err) return next();
    if (err instanceof PermissionDenied) {
      res.render('error.jade', {user: req.user, title: "Доступ запрщен"});
    } else next(err);
  })
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/', routes.index);
app.post('/login', function(req, res, next){ auth.login(req, res, next); }, function(req, res) { res.redirect('back'); } );
app.all('/logout', function(req, res, next){ auth.logout(req, res, next); },  function(req, res) { res.redirect('back'); } );

function PermissionDenied(msg) {
  this.name = 'PermissionDenied';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}
util.inherits(PermissionDenied, Error);

var havePermissionTo = function(group) {
  return function(req, res, next) {
    next();
    //if (req.user) return next();
    //next(new PermissionDenied("No permission to " + group));
  }
}

app.get('/docs'
  , havePermissionTo("docs")
  , function(req, res, next){
      dc.getDocs({}, function(err, docs) {
        if (err) return next(err);
        res.docs = docs;
        next(); 
      });
    }
  , routes.docs);

app.get('/doc/:id'
  , havePermissionTo("doc")
  , function(req, res, next) {
      dc.getDoc(req.params.id, function(err, doc){
        if (err) return next(err);
        res.doc = doc;
        next();
      });
    }
  , routes.doc);

app.get('/doc-add', havePermissionTo("doc add"), routes.docadd);

app.post('/doc-add'
  , havePermissionTo("doc add")
  , function(req, res, next) {
      var form = req.body;
      form.user = req.user;
      form.files = req.files;

      dc.addDocument(
        form
      , function(err, id){
          if (err) {
            form.error = err;
            req.docaddform = form;
            next();
          }
          else res.redirect('/doc/' + id);
        });
    }
  , routes.docadd);

//app.get('/add-users', function() { auth._addUser([ {name: 'mr0re1', pass: 'retro'} ] ) } );

app.get('/person'
  , havePermissionTo("person")
  , function(req, res, next) {
      pc.getPersons({}, function(err, persons){
        if (err) return next(err);
        res.persons = persons;
        next();
      });
    }
  , routes.persons );


app.get('/person/:id'
  , havePermissionTo("person")
  , function(req, res, next) {
      pc.getPerson(req.params.id, function(err, person){
        if (err) return next(err);
        res.person = person;
        next();
      });
    }
  , routes.person );

app.get('/person-add', havePermissionTo("person add"), routes.personadd);
app.post('/person-add'
  , havePermissionTo("person add")
  , function(req, res, next) {
      var form = req.body;
      form.user = req.user;
      form.files = req.files;
      pc.addPerson(
        form
      , function(err, id){
          if (err) {
            form.error = err;
            req.personaddform = form;
            next();
          }
          else res.redirect('/person/' + id);
        });
    }
  , routes.personadd);

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

app.get('/audio/:id', havePermissionTo('audio'), uploadFile.bind(null, __dirname + '/data/audio/'));
app.get('/photo/:id', havePermissionTo('photo'), uploadFile.bind(null, __dirname + '/data/photo/'));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
