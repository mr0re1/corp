var util = require('util');


function PermissionDeniedError(msg) {
  this.name = 'PermissionDenied';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}
util.inherits(PermissionDeniedError, Error);


var checkPerm = function (req, res, next) {
    if (req.user) return next();
    next(new PermissionDeniedError("No permission to "));
}

var pd_error_screen = function (err, req, res, next) {
  if (! err) return next();
  if (err instanceof PermissionDeniedError) 
    res.render('error.jade', {user: req.user, title: 'Permission denied'})
  else next(err)
};

var install = function(app) {
  //app.checkPermission =
//  app.use(checkPerm);
  app.use(pd_error_screen);  
}

module.exports = install;
