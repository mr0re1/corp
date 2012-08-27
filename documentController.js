var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


DocumentController = function(host, port, fn) {
	this.db = new Db('corp', new Server(host, port, {auto_reconnect: true}, {}));
	this.collectionName = 'docs';
	var _this = this;
  this.db.open( function(err, dummy) {
		if (err) fn(err);// TODO : 'throw err' or 'return fn(err)' ?
		else fn(null, this);
	});
};

DocumentController.prototype.getCollection = function(fn) {
	this.db.collection(this.collectionName, fn);
};

DocumentController.prototype.getDocs = function(opt, fn) {
	this.getCollection(function(err, collection){
		if (err) return fn(err);
		collection.find(opt, {_content:false}).toArray(function(err, docs){
			if (err) fn(err);
			else fn(null, docs);
		});
	});
};

DocumentController.prototype.getDoc = function(id, fn) {
	this.getCollection(function(err, collection){
		if (err) return fn(err);
		collection.findOne({_id: collection.db.bson_serializer.ObjectID.createFromHexString(id) }, function(err, doc){
			if (err) fn(err);
			else fn(null, doc);
		});
	});
};

//DocumentController.prototype.userAdd = function(user, fn) {
//	if (user.name === undefined) { fn(new Error('Need name')); return }
//	var _this = this;
//	this.userGet(user.name, function(err, otherUser){
//		
//		if (err) { fn(err); return }
//		if (otherUser !== null) { fn(new Error("User with this name is already exist")); return; }
//		
//		_this.getCollection(function(err, collection){
//			if (err) { fn(err); return }
//			user.created_at = new Date();
//			collection.insert(user, fn);
//		});
//		
//	});
//	
//	
//};

exports.DocumentController = DocumentController;