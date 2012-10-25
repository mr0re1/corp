// TODO: use config for host port and collections names
var CollectionProvider = require('./collectionProvider').CollectionProvider;

var dbn = 'corptest'
  , pos = 0;

var dbocb = function(name) {
  return function(err, done) {
    if (err) throw err;
    console.log(name + ' connect done');
    pos++;
    if (pos == 2) start();
  } 
}

var LexemeController = require('./lexemeController').LexemeController
  , lcp = new CollectionProvider('localhost', 27017, dbn, 'lex', dbocb('lex'))
  , lc = new LexemeController(lcp);

var DocumentController = require('./documentController').DocumentController
  , dcp = new CollectionProvider('localhost', 27017, dbn, 'docs', dbocb('docs'))
  , dc = new DocumentController(dcp, lc);


var doc = {
  name: 'test doc',
  author: 'mr0re1',
  content: [
    { 
      _type: 'lex',
      name: "hello",
      descr: { type: 'S', }
    },
    " ",
    {
      _type: 'lex',
      name: "wicked",
      descr: [
        {type: 'S'},
        {type: 'A'},
      ]
    },
    " ",
    "world",
  ]
};

var start = function() {
  console.log('Start test');
  var addDoc = function() {
    dc.addDocument(doc, console.log.cf());  
  }
  dc.compressDocument(doc, addDoc.cf());
}
