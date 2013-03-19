var FM = require('./fileManager').FileManager;
var fs = require('fs');


var fm = new FM({
  "app_key": "ly7wj2y5woa6hxp",
  "app_secret": "2oez04swwobjik9",
  "oauth_token": "0s38odstrtwfn46",
  "oauth_token_secret": "z1gsizc6xik3ppd",
  "uid": "23698457"
});


var clb = function() {
  console.log(arguments);
};

//fm.upload('/home/mr0re1/Pictures/1309533105174.jpg', 'photo/sanchopanca', clb);

fm.getDirectLink('photo/sanchopanca', clb);