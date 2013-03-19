var dbox  = require("dbox")
  , async = require("async")
  , fs = require("fs");

var FileManager = function(opt) {
  this.dbox_app = dbox.app({app_key: opt.app_key, app_secret: opt.app_secret});
  this.dbox_client = this.dbox_app.client({oauth_token: opt.oauth_token, oauth_token_secret: opt.oauth_token_secret, uid: opt.uid});
  
  opt.routes = opt.routes || [];
  this.routes = [];
      
  for (var i = 0; i < opt.routes.length ;++i) {
    this.routes.push(RegExp(opt.routes[i]) );
  }
  
  this.dlcache = {};
};

var proto = FileManager.prototype;

proto.patternMatch = function(url) {
  return function(re, clb) { clb(re.test(url)) }
}

proto.getDirectLink = function(path, fn) {
  var that = this;
  
  if (this.dlcache[path]) {
    var c = this.dlcache[path]
      , now = new Date();
    if (now < c.expires) return fn(null, c.url);
  }
  
  this.dbox_client.media(path, function(status, reply){
    if (status != '200') return fn(reply);
    that.dlcache[path] = { url: reply.url, expires: new Date(reply.expires) };
    fn (null, reply.url);
  })  
};

proto.mkdir = function(path, fn) {
  this.dbox_client.mkdir(path, function(status, reply){
    if (status == '200' || status == '403') fn();
    else fn(reply);
  });
};

proto.rm = function(path, fn) {
  this.dbox_client.rm(path, function(status, reply){
    if (status == '200') fn(null, reply)
    else fn(reply);
  });
}

proto.upload = function(source_path, target_path, fn){
  var that = this;
  fs.readFile(source_path, function(err, data){
    if (err) return fn(err);
    that.dbox_client.put(target_path, data, function(status, reply){
      if (status == '200') fn(null, reply)
      else {
        fn(reply);
        console.error(reply);
      }
    });
  });
};

proto.middleware = function(req, res, next) {
  var that = this
    , url = req.url;
  
  async.detect(this.routes, this.patternMatch(url), function(pattern) {
    if (! pattern) return next();
    that.getDirectLink(url, function(err, dl) {
      if (err) return next();
      res.redirect(dl);
    })
  });
};

exports.FileManager = FileManager;




