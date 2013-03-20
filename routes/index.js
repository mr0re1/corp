module.exports = function(app) {
  [ 
    'auth'
  ,  'document'
  , 'search'
  ,  'main'
//  , 'person'
  ].forEach(function(name) { 
    require('./' + name)(app)
  })
}
