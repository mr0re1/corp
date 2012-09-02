var async = require('async')
	, path = require('path')
	, fs = require('fs')
	, CollectionProvider = require('./collectionProvider').CollectionProvider;

PersonController = function(cp) {
	this.cp = cp;
};

PersonController.prototype.getPersons = function(opt, fn) {
	this.cp.find(opt, {biography:false}, fn);
};

PersonController.prototype.getPerson = function(id, fn) {
	this.cp.getById(id, fn);
};

var moveFile = function(from, to, fn) {
	fs.rename(tmp_path, target_path, function(err) {
		if (err) fn(err);
		fs.unlink(tmp_path, function() {
			if (err) fn(err);
			else fn(null, target_path);
		});
	});
}

PersonController.prototype.addPerson = function(form, fn) {
		var _this = this;
		async.series({
			person: function(fn){
				//TODO: Check form
				var p = {
					name: form.name,
					biography: form.biography,
				};
				fn(null, p);
			},
			photo: function(fn) {
				if (! form.files.photo || ! form.files.photo.size ) return fn(null, null);
				var file_name = path.basename(form.files.photo.path);
				var target_path = './data/photo/' + file_name;
				fs.rename(form.files.photo.path, target_path, function(err){
					if (err) fn(err);
					else fn(null, file_name);
				});
			},
		},
		function(err, r) {
			if (err) return fn(err);
			r.person.created_at = new Date();
			r.person.added_by = form.user;
			if (r.photo) r.person.photo = r.photo;
			_this.cp.insert(r.doc, function(err, inserted){
				if(err) fn(err);
				else fn(null, inserted[0]._id);
			});
		}
	);
}

exports.PersonController = PersonController;