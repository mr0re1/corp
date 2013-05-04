module.exports = function(app) {
  [ 
    'auth'
  , 'document'
  , 'search'
  ,  'main'
  ].forEach(function(name) { 
    require('./' + name)(app)
  })
}
