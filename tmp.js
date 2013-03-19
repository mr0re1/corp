var async = require('async');

var arr = [500, 200, 100];

var f = function(n, fn) {
  setTimeout(
    function() { 
      console.log(n);
      fn(null, n);
    },
    n
  );
}

async.map(arr, f, console.log)
