module.exports = function(app) {
  app.post(
    '/login', 
    function(req, res, next){ app.auth.login(req, res, next); }, 
    function(req, res) { res.redirect('back'); } );

  app.all(
    '/logout', 
    function(req, res, next){ app.auth.logout(req, res, next); },  
    function(req, res) { res.redirect('back'); } );

  app.all(
    '/api*',
    function(req, res, next) {
      if (! req.user) next(new Error('Invalid user'))
      else next();
    }
  )
}
