var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var CollectionProvider = function(host, port, db_name, collection_name) {
	this.db = new Db(db_name, new Server(host, port, {auto_reconnect: true}, {}));
	this.collectionName = collection_name;
	this.db.open( function(err, dummy) { if (err) throw err; });
};

CollectionProvider.prototype.getCollection = function(fn) {
	this.db.collection(this.collectionName, fn);
};

CollectionProvider.prototype.find = function() {
	if (! arguments.length) throw new Error("Call CollectionProvider.find without arguments");
	var fn = arguments[arguments.length - 1];
	var args = Array.prototype.slice.call(arguments, 0, -1);
	this.getCollection(function(err, col){
		if (err) fn(err);
		else col.find.apply(col, args).toArray(fn);
	});
};

CollectionProvider.prototype.findOne = function() {
	if (! arguments.length) throw new Error("Call CollectionProvider.findOne without arguments");
	var fn = arguments[arguments.length - 1];
	
	var args = arguments;
	this.getCollection(function(err, col){
		if (err) fn(err);
		else col.findOne.apply(col, args);
	});
}

CollectionProvider.prototype.getById = function(id, fn) {
	this.getCollection(function(err, col){
		if(err) fn(err);
		else col.findOne({_id: col.db.bson_serializer.ObjectID.createFromHexString(id)}, fn);
	})
};

CollectionProvider.prototype.insert = function(item, fn) {
	this.getCollection(function(err, col){
		if (err) fn(err);
		else col.insert(item, {safe:true}, fn);
	})
};

exports.CollectionProvider = CollectionProvider;
