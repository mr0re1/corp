module.exports = function(app) {
  app.get('/*', function(req, res){
    if (req.user) res.render( 'app', { user: req.user } )
    else res.render('loginpage', {});
  });
}
