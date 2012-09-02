
/*
 * GET home page.
 */

var dateFormat = function(date) {
  if (! date) return "";
  return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}

exports.index = function(req, res){
  res.render(
    'index',
    {
      user: req.user,
      title: 'Express',
      
    });
};

exports.docs = function(req, res){
  res.render(
    'docs',
    {
      dateFormat: dateFormat,
      user: req.user,
      title: 'Documents',
      docs: res.docs,
    }
  );
};

exports.doc = function(req, res){
  res.render(
    'doc',
    {
      user: req.user,
      title: 'Document view',
      doc: res.doc,
    }
  );
};

exports.docadd = function(req, res){
  res.render(
    'docadd',
    {
      form: req.docaddform || {},
      user: req.user,
      title: 'Document Add',
    }
  );
};

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

