var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


UserProvider = function(host, port, fn) {
	this.db = new Db('corp', new Server(host, port, {auto_reconnect: true}, {}));
	this.collectionName = 'users';
	var _this = this;
  this.db.open( function(err, dummy) {
		if (err) throw err; // TODO : 'throw err' or 'return fn(err)' ?
		fn(null, this);
	});
};

UserProvider.prototype.getCollection = function(fn) {
	this.db.collection(this.collectionName, fn);
};

UserProvider.prototype.userGet = function(name, fn) {
	this.getCollection(function(err, collection){
		if (err) { fn(err); return }
		collection.findOne({'name': name}, function(err, user){
			if (err) fn(err);
			else fn(null, user);
		});
	});
};

UserProvider.prototype.userAdd = function(user, fn) {
	if (user.name === undefined) { fn(new Error('Need name')); return }
	var _this = this;
	this.userGet(user.name, function(err, otherUser){
		
		if (err) { fn(err); return }
		if (otherUser !== null) { fn(new Error("User with this name is already exist")); return; }
		
		_this.getCollection(function(err, collection){
			if (err) { fn(err); return }
			user.created_at = new Date();
			collection.insert(user, fn);
		});
		
	});
	
	
};

exports.UserProvider = UserProvider;