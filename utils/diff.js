require('functional-node').load().install();


/**
 *Get the set of actions for make from first argument second argument
 *
 *@param {Object|Array} from First "objetct"
 *@param {Object|Array} to   Second "object"
 *@return {Array} Sequence of edit commands
 */

var diff = function(from, to) {
  if (Array.isArray(from)) {
    if (Array.isArray(to)) return diffArray(from, to)
    else return ("This different types objects");
  }
}



var diffObject = function(from, to) {
  var fk = Object.keys(from).sort()
    , tk = Object.keys(to).sort();
}

var diffArray = function(from, to) {
  var flen = from.length
    , tlen = to.length
    , z = new Array(flen + 1);
  for (var i = 0; i <= flen; ++i) z[i] = new Array(tlen + 1);
  z[0][0] = [];

  var add = function(fl, tl) { 
    return [ ['a', tl - 1, to[tl - 1]] ].concat(D(fl, tl - 1));
  };
  var del = function(fl, tl) { 
    return [ ['d', fl - 1] ].concat(D(fl - 1, tl));
  };

  var D = function(fl, tl) {
    if (z[fl][tl] !== undefined) return z[fl][tl];

    if (fl == 0) return add(fl, tl);
    if (tl == 0) return del(fl, tl);
    if (from[fl - 1] == to[tl - 1]) return z[fl][tl] = D(fl - 1, tl - 1);

    var a = add(fl, tl)
      , d = del(fl, tl);
    return z[fl][tl] = (a.length < d.length) ? a : d;

  };
  
  return D(flen, tlen).reverse();
};



