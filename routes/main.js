module.exports = function(app) {
  app.get('/', function(req, res){
    res.render(
      'index',
      { user: req.user
      , title: 'Hello'
      }
    )
  });
}