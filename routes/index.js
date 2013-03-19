module.exports = function(app) {
  [ 
    'auth',
    'document',
    'main'
//  , 'person'
//  , 'search'
  ].forEach(function(name) { 
    require('./' + name)(app)
  })
}
