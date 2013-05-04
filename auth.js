var Auth = function(opt) {
    opt = opt || {};
    this.provider = opt.user_controller;
} 

Auth.prototype.login = function(req, res, next) {
    var name = req.body.name;
    var pass = req.body.password;
    
    this.provider.authenticate(name, pass, function(err, user) {
        if (err) return next(err);
        req.session.user = user;
        next();
    });
};

Auth.prototype.logout = function(req, res, next) {
    delete req.session.user;
    next();
}

Auth.prototype.middleware = function(req, res, next) {
    res.locals.user = req.user = '';
    if(req.session.user) 
      res.locals.user = req.user = req.session.user.name;
    
    next();
};

var install = function(app, opt) {
  opt = opt || {};
  opt.user_controller = app.user_controller;

  var a = new Auth(opt);
  app.use(a.middleware);
  app.auth = a;
}

module.exports = install;
