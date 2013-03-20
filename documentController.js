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
	this.cp.getById(id, function(doc){
    this.decompressDocument(doc, fn);
  }.cf(fn, this));
};

prot.loadDocument = function(form, fn) {
  var doc = {
    name: form.name,
    source: form.source,
    create_time: new Date(),
    author: form.user,
    content: form.content,
    audio: form.audio,
  };
  this.compressDocument(doc, function(c_doc) {
      this.addDocument(c_doc, fn)
    }.cf(fn, this)
  );
}

prot.removeDocument = function(id, fn) {
	this.cp.removeByID(id,fn);
}

prot.publicDocument = function(id, fn) {
	var _id = this.cp.IDfromString(id);
	this.cp.update({'_id': _id}, {'$set': {'public': true}}, {'safe': true}, fn);
}

prot.unpublicDocument = function(id, fn) {
	var _id = this.cp.IDfromString(id);
	this.cp.update({'_id': _id}, {'$set': {'public': false}}, {'safe': true}, fn);
}

prot.addDocument = function(doc, fn) {
  var addE = function(ins) {
    var doc_id = ins[0]._id;
    fn(null, doc_id);

    var contl = doc.content.length;
    for (var pos = 0; pos < contl; ++pos) {
      var item = doc.content[pos];
      if (typeof item != 'string') continue;
      if (item.charAt(0) != 'l') continue;
      this.lc.addEntry(item.slice(1), doc_id, pos, function(){}.cf());
    }
  }
  this.cp.insert(doc, addE.cf(fn, this)); 
}

prot.compressDocument = function(doc, fn) {
  var compr_cont = []
    , that = this;

  var compressQueue = function() {
    if (! doc.content.length) {
      doc.content = compr_cont.reverse();
      return fn(null, doc); };

    that.compressItem( 
      doc.content.pop(), 
      function(item) {
        compr_cont.push(item);
        compressQueue();
      }.cf(fn));
  };
  compressQueue();
}

prot.compressItem = function(item, fn) {
  var addL = function(hash) {fn(null, 'l' + hash)};
  if (typeof item == 'string') return fn(null, 'p' + item);
  if (item._type == 'lex') return this.lc.prepareLexeme(item, addL.cf(fn));
  fn (null, item);
}

prot.decompressDocument = function(doc, fn) {
  async.map(doc.content, this.decompressItem.bind(this), function(content) {
    doc.content = content;
    fn(null, doc);
  }.cf(fn, this));
}

prot.decompressItem = function(item, fn) {
  if ('string' != typeof item) return fn(null, item);
  var fstCh = item.charAt(0)
    , tail = item.slice(1);
  if (fstCh == 'p') return fn(null, tail);
  if (fstCh == 'l') { return this.lc.getLexeme(tail, fn) }
  
  fn(new Error("undefined item: " + item));
}

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
    while (left > 0 && 'string' === typeof cont[left]) left--;
    while (right < conl && 'string' === typeof cont[right]) right++;
    doc.content = doc.content.slice(left, right);
    this.decompressDocument(doc, fn);
  }.cf(fn, this))  
}

exports.DocumentController = DocumentController;
