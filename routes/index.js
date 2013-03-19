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
