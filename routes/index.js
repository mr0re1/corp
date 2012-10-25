module.exports = function(app) {
  [ 
    'main'
  , 'auth' 
  , 'document'
  ].forEach(function(name) { 
    require('./' + name)(app)
  })
}


/*
var dateFormat = function(date) {
  if (! date) return "";
  return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
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

exports.persons = function(req, res){
  res.render(
    'persons',
    {
      user: req.user,
      title: 'Респонденты',
      persons: res.persons,
    }
  );
};

exports.person = function(req, res){
  res.render(
    'person',
    {
      user: req.user,
      title: 'Респондент ' + res.person.name,
      person: res.person,
    }
  );
};

exports.personadd = function(req, res){
  res.render(
    'personadd',
    {
      form: req.personaddform || {},
      user: req.user,
      title: 'Добавление респондента',
    }
  )
};
*/
