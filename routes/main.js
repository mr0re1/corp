module.exports = function(app) {
  app.get('/*', function(req, res){
    res.render(
      'app',
      { 
        user: req.user
     // , title: 'Hello' 
      }
    )
  });
}
