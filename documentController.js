require('./carefree');

var async = require('async')
	, path = require('path')
	, fs = require('fs')
	, parser = require('./utils/parser/parser');

var moveFile = function(from, to, fn) {
	fs.rename(tmp_path, target_path, function(err) {
		if (err) fn(err);
		fs.unlink(tmp_path, function() {
			if (err) fn(err);
			else fn(null, target_path);
		});
	});
}

DocumentController = function(cp, lc, fm) {
	this.cp = cp;
  this.lc = lc;
	this.fm = fm;
}

var prot = DocumentController.prototype;

prot.getDocs = function(opt, fn) {
	this.cp.find(opt, {content: false, source: false}, fn);
};

prot.getDoc = function(id, fn) {
	this.cp.getById(id, fn);   //this.decompressDocument(doc, fn);
};

prot.loadDocument = function(form, fn) {
  var doc = {
    name: form.name,
    source: form.source,
    create_time: new Date(),
    author: form.user,
    content: form.content,
    audio: form.audio,
  }
  
  async.mapSeries(doc.content, this.compressItem.bind(this), function(err, result){
    if(err) fn(err)
    else {
      doc.content = result;
      this.addDocument(doc, fn)
    }
  }.bind(this));
}

prot.publicDocument = function(id, fn) {
	var _id = this.cp.IDfromString(id);
	this.cp.update({'_id': _id}, {'$set': {'public': true}}, {'safe': true}, fn);
};

prot.unpublicDocument = function(id, fn) {
	var _id = this.cp.IDfromString(id);
	this.cp.update({'_id': _id}, {'$set': {'public': false}}, {'safe': true}, fn);
};

prot.addDocument = function(doc, fn) {
  var self = this;

  this.cp.insert(doc, function(err, rec){
    var doc_id = rec[0]._id;

    var cl = doc.content.length
      , le = [];
    
    //prepare array [hash, position]
    for (var p = 0; p < cl; ++p) {
      var item = doc.content[p]
      if (typeof item == 'string' && item.charAt(0) == 'l') //Is lexeme
        le.push([item.slice(1), p]);
      else if (item._type == 'lex-set') 
        for (var i = 0; i < item.lexems; i++){
          var l = item.lexems[i];
          if (typeof l == 'string' && l.charAt(0) == 'l')
            le.push([l.slice(1), p]);
        }
    }
  
    async.eachSeries(
      le
    , function(i, cb){ self.lc.addEntry(i[0], doc_id, i[1], cb) }
    , function(err){ fn(err, doc_id) });
  }); 
};


prot.compressItem = function(item, fn) {
  var self = this;
  if (typeof item == 'string') 
    return fn(null, 'p' + item);
  if (item._type == 'lex') 
    return self.lc.prepareLexeme(item, function (err, hash) {
      if (err) fn(err)
      else fn(null, 'l' + hash);
    });
  if (item._type == 'lex-set'){
    async.mapSeries(item.lexems, self.compressItem.bind(self), function(err, cl){
      if (err) fn(err)
      else 
        fn(null, {
          _type : 'lex-set'
        , name: item.name
        , lexems: cl
        }); 
    });
    return;
  }
    
  fn (null, item);
};

//TODO: Remove decompressDocument method
//prot.decompressDocument = function(doc, fn) {
//  async.map(doc.content, this.decompressItem.bind(this), function(content) {
//    doc.content = content;
//    fn(null, doc);
//  }.cf(fn, this));
//};
//TODO: Remove decompressItem method
//prot.decompressItem = function(item, fn) {
//  if ('string' != typeof item) return fn(null, item);
//  var fstCh = item.charAt(0)
//    , tail = item.slice(1);
//  if (fstCh == 'p') return fn(null, tail);
//  if (fstCh == 'l') { return this.lc.getLexeme(tail, fn) }
//  
//  fn(new Error("undefined item: " + item));
//};

prot.search = function(params, fn) {
  var res = []
    , curs
    , limit = 10;
  //TODO: make limit parametr
  var collectResult = function (docId, pos) {
    if (! docId || ! limit) return fn(null, res);
    
    this.getDocFragment(docId, pos, function(doc){
      if(doc){
        limit--;
        res.push(doc);
      }
      curs.next( collectResult );
    }.cf(fn));
  }.cf(fn, this);

  this.lc.search(params, function(cursor) {
    curs = cursor;
    curs.next( collectResult );
  }.cf(fn));
}

prot.getDocFragment = function(docId, pos, fn) {
  this.cp.getById(docId, function(doc){
    if (! doc) return fn();

    var left = pos
      , right = pos
      , cont = doc.content
      , conl = cont.length;
    
    doc.content[pos] = '!' + doc.content[pos];
    while (left > 0 && 'string' === typeof cont[left]) left--;
    while (right < conl && 'string' === typeof cont[right]) right++;
    doc.content = doc.content.slice(left, right);
    fn(null, doc);
    //this.decompressDocument(doc, fn);
  }.cf(fn, this))  
}

exports.DocumentController = DocumentController;
