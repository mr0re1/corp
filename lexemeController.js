require('functional-node').load().install();
require('./carefree');

var LexemeController = function(cp) {
	this.cp = cp;
};

var proto = LexemeController.prototype;

/**
 * Get lexeme
 *
 * @param {String} hash The lexeme hash.
 * @param {Function} fn The callback.
 */
LexemeController.prototype.getLexeme = function(hash, fn) {
  this.cp.findOne({_id: hash}, fn);
};


var EntiresCursor = function(cursor) {
  this.cursor = cursor;
}

EntiresCursor.prototype.next = function(fn) {
  if (! this.lex) 
    return this.cursor.nextObject(function(lex) {
      if (! lex) return fn();
      this.lex = lex;
      this.docList = [];
      for (var d_id in this.lex['in']) 
        this.docList.push(d_id);
      this.next(fn);
    }.cf(fn, this));
  
  if (! this.docList.length && ! this.docId) {
     this.lex = null;
     return this.next(fn); }

  if (! this.docId) {
    this.docId = this.docList.pop();
    this.posList = this.lex['in'][this.docId];
    return this.next(fn); }

  if (! this.posList.length) {
    this.docId = null;
    return this.next(fn); }

  fn (null, this.docId, this.posList.pop());
}

/**
 * Search
 *
 *
 */
proto.search = function(lexeme, fn) {
  this.cp.findCursor(lexeme, function(cursor) {
    fn(null, new EntiresCursor(cursor)); 
  }.cf(fn));
}

/**
 *Prepare Lexeme 
 *
 *@param {Object} The lexeme.
 *@param {Function} The callback.
 */
proto.prepareLexeme = function(lexeme, fn) {
  var hash = this.calcHash(lexeme);

  var check = function(lex) {
    if (lex) return fn(null, lex._id);
    lex = lexeme;
    lex._id = hash;
    lex.in = {};
    this.cp.insert(lex, {safe: true}, function(err, rec) {
      if (err) fn(err) 
      else fn(null, rec[0]._id)
    });
  };
  this.getLexeme(hash, check.cf(fn, this));
};


/**
 * Remove entry of lexeme from collection
 */
proto.removeEntry = function(hash, doc_id, pos, fn) {
  pos = pos || '*';
  var place = 'in.' + doc_id;
  var processLexeme = function(lex) {
    var upd = (pos == '*' || !Array.isArray(lex.in[doc_id]))
      ? {$unset: {place: 1}}
      : {$pull: {place: pos}};
    this.cp.update({_id: lex._id}, upd, {safe: true}, fn);
  };
  this.cp.getLexeme(hash, processLexeme.cf(fn, this));
};


/**
 * Add entry to lexeme collection
*/
proto.addEntry = function(hash, doc_id, pos, fn) {
  var place = 'in.' + doc_id;
  var push = {$push: {}}; push['$push'][place] = pos;
  var set  = {$set:  {}};  set['$set'][place] = [pos];
  var processLexeme = function(lex) {
    if(Array.isArray(lex.in[doc_id]))
      this.cp.update({_id: lex._id}, push, {safe: true}, fn)
    else 
      this.cp.update({_id: lex._id}, set, {safe: true}, fn);
  };
  this.getLexeme(hash, processLexeme.cf(fn, this));
}

/**
 *Calc hash for lexeme
 * 
 * @param lex The lexeme.
 * @return {String} The hash.
 */
proto.calcHash =  function(lex) {
  var hash = lex.name + '{' + lex.descr.first + '(' + lex.descr.lit + ')';
  var keys = [];
  for (var k in lex.descr) 
    if (k != 'first' && k != 'lit' && k != 'name') keys.push(k);

  if (keys.length) 
    hash += '=' + keys.join(',');

  hash += '}';

  return hash; 
}

exports.LexemeController = LexemeController;
