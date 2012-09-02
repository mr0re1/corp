var async = require('async')
	, path = require('path')
	, fs = require('fs')
	, parser = require('./utils/parser/parser');

var getLexemes = function(item) {
	if (item._type == 'lex') return [item];
	if (! item._content )	 return [];
	var res = [];
	for (var ind in item._content) {
		var r = getLexemes(item._content[ind]);
		for (var ri in r) res.push(r[ri]);
	}
	return res;
}

var moveFile = function(from, to, fn) {
	fs.rename(tmp_path, target_path, function(err) {
		if (err) fn(err);
		fs.unlink(tmp_path, function() {
			if (err) fn(err);
			else fn(null, target_path);
		});
	});
}

DocumentController = function(cp, fn) {
	this.cp = cp;
}

DocumentController.prototype.getDocs = function(opt, fn) {
	this.cp.find(opt, {_content: false}, fn);
};

DocumentController.prototype.getDoc = function(id, fn) {
	this.cp.getById(id, fn);
};


DocumentController.prototype.addDocument = function(form, fn) {
	var _this = this;
	async.series({
		doc: parser.processString.bind(null, form.razm),
		audio: function(fn) {
			if (! form.files.audio || ! form.files.audio.size ) return fn(null, null);
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

exports.DocumentController = DocumentController;