'use strict';
require('./carefree');

//var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
//var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

//var CollectionProvider = function (host, port, db_name, collection_name, fn) {
//	this.db = new Db(db_name, new Server(host, port, {auto_reconnect: true}, {}));
//	this.collectionName = collection_name;
//	this.db.open(fn);
//};
//

var CollectionProvider = function(db, collection_name) {
  this.db = db;
  this.collectionName = collection_name;
}

var prot = CollectionProvider.prototype;

prot.getCollection = function (fn) {
	this.db.collection(this.collectionName, fn);
};

prot.proxyMethod = function (method) {
  return function () {
    var args = Array.prototype.slice.apply(arguments);
    var fn = args[args.length - 1];
    if (typeof fn != 'function') 
      throw new Error('Call collection method without callback');
    var execMethod = function (col) { col[method].apply(col, args) };
    this.getCollection(execMethod.cf(fn, this));
  };
};

prot.findOne = prot.proxyMethod('findOne');
prot.insert = prot.proxyMethod('insert');
prot.update = prot.proxyMethod('update');
prot.findCursor = prot.proxyMethod('find');

prot.find = function () {
  var args = Array.prototype.slice.apply(arguments)
    , fn = args.pop();
  var toArray = function (cursor) { cursor.toArray(fn) };
  args.push(toArray.cf(fn));
  this.findCursor.apply(this, args);
};
prot.IDfromString = function (id_str) {
  return this.db.bson_serializer.ObjectID.createFromHexString(id_str);
};
prot.getById = function (id, fn) {
  var _id = this.IDfromString(id);
  this.findOne({'_id': _id}, fn);
};

exports.CollectionProvider = CollectionProvider;
