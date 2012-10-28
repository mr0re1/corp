module.exports = function(app) {
  [ 
    'main'
  , 'auth' 
  , 'document'
  , 'person'
  , 'search'
  ].forEach(function(name) { 
    require('./' + name)(app)
  })
}


exports.search = function(req, res){
  res.render(
    'search',
    { 
      form: req.searchform || {},
      user: req.user, 
      title: 'Search',
    }
  );
}

