'use strict';
require('./carefree');
var ObjectID = require('mongodb').ObjectID;

var CollectionProvider = function(db, collection_name) {
  this.db = db;
  this.collectionName = collection_name;
}

var prot = CollectionProvider.prototype;

CollectionProvider.prototype.getCollection = function (fn) {
	this.db.collection(this.collectionName, fn);
};

var proxyMethod = function (method) {
  return function () {
    var args = Array.prototype.slice.apply(arguments);
    var fn = args[args.length - 1];
    if (typeof fn != 'function') 
      throw new Error('Call collection method without callback');
    var execMethod = function (col) { col[method].apply(col, args) };
    this.getCollection(execMethod.cf(fn, this));
  };
};

CollectionProvider.prototype.findOne = proxyMethod('findOne');
CollectionProvider.prototype.insert = proxyMethod('insert');
CollectionProvider.prototype.update = proxyMethod('update');
CollectionProvider.prototype.findAndModify = proxyMethod('findAndModify');
CollectionProvider.prototype.findCursor = proxyMethod('find');


CollectionProvider.prototype.find = function () {
  var args = Array.prototype.slice.apply(arguments)
    , fn = args.pop();
  var toArray = function (cursor) { cursor.toArray(fn) };
  args.push(toArray.cf(fn));
  this.findCursor.apply(this, args);
};
CollectionProvider.prototype.IDfromString = function (id_str) {
  return this.db.bson_serializer.ObjectID.createFromHexString(id_str);
};
CollectionProvider.prototype.getById = function (id, fn) {
  var _id = this.IDfromString(id);
  this.findOne({'_id': _id}, fn);
};
CollectionProvider.prototype.removeByID = function(id, fn){
	var _id = this.IDfromString(id);
	this.findAndModify({'_id': _id}, {}, {}, {'remove': true}, fn);
}
exports.CollectionProvider = CollectionProvider;
