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

DocumentController = function(cp, lc, fn) {
	this.cp = cp;
  this.lc = lc;
}

var prot = DocumentController.prototype;

prot.getDocs = function(opt, fn) {
	this.cp.find(opt, {_content: false}, fn);
};

prot.getDoc = function(id, fn) {
	this.cp.getById(id, fn);
};

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
prot.loadDocument = function(form, fn) {
	var _this = this;
	async.series({
		doc: parser.processString.bind(null, form.razm),
		audio: function(fn) {
			if (! form.files.audio || ! form.files.audio.size ) return fn();
			var file_name = path.basename(form.files.audio.path);
			var target_path = './data/audio/' + file_name;
			fs.rename(form.files.audio.path, target_path, function(err){
				if (err) fn(err);
				else fn(err, file_name);
			});
		}
	},
	function(err, r) {
		if (err) return fn(err);
		r.doc.name = form.name;
		r.doc.created_at = new Date();
		r.doc.author = form.user;
		if (r.audio) r.doc.audio = r.audio;
		_this.cp.insert(r.doc, function(err, inserted){
			if (err) return fn(err);
			var doc_id = inserted[0]._id;
			fn(null, doc_id);
		});
	});
}

prot.addDocument = function(doc, fn) {
  var addE = function(ins) {
    var doc_id = ins[0]._id;
    var contl = doc.content.length;
    var onAdd = (function(){}).cf(fn, this); // !!!!!!!!!!!!!!!!!!!!
    for (var pos = 0; pos < contl; ++pos) {
      var item = doc.content[pos];
      if (typeof item != 'string') continue;
      if (item.charAt(0) != 'l') continue;
      this.lc.addEntry(item.slice(1), doc_id, pos, onAdd);
    }
    fn(doc_id);
  }
  this.cp.insert(doc, addE.cf(fn, this));
}

prot.compressDocument = function(doc, fn) {
  var compileDoc = function(parts) {
    doc.content  = parts.content;
    fn(null, doc);
  }

  async.parallel({
    content: async.map.bind(this, doc.content, this.compressItem.bind(this))
  }
  , compileDoc.cf(fn, this));
}

prot.compressItem = function(item, fn) {
  var addL = function(hash) {fn(null, 'l' + hash)};
  if (typeof item == 'string') return fn(null, 'p' + item);
  if (item._type == 'lex') return this.lc.prepareLexeme(item, addL.cf(fn));
  fn (null, item);
}

exports.DocumentController = DocumentController;
