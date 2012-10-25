var dateFormat = function(date) {
  if (! date) return "";
  return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}

var put2obj = function(obj, fn /*, key1, key2, ... */) {
  var keys = [].slice.call(arguments, 2)
    , keyl = keys.length;

  return function() {
    var vals = [].slice.call(arguments)
      , vall = vals.length;
    for (var i = 0; i < vall && i < keyl; ++i) 
      if(keys[i]) obj[keys[i]] = vals[i];
    if ('function' == typeof fn) fn();
  }
};

module.exports = function(app) {

  var doc_list_get = function(req, res, next) {
    app.document_controller.getDocs(
      {}, put2obj(res, next, 'docs').cf(next));
  };
  
  var doc_list_view = function(req, res){
    res.locals = req.user;
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

  var doc_get = function(req, res, next) {
    app.document_controller.getDoc(
      req.params.id, put2obj(res, next, 'doc').cf(next));
  };

  var doc_view = function(req, res){
    res.render(
      'doc',
      {
        user: req.user,
        title: 'Document view',
        doc: res.doc,
      }
    );
  };
  
  var doc_add =  function(req, res, next) {
    var form = req.body;
    form.user = req.user;
    form.files = req.files;

    app.document_controller.addDocument(
      form
    , function(err, id){
        if (err) {
          form.error = err;
          req.docaddform = form;
          next();
        }
        else res.redirect('/doc/' + id);
      });
  };

  var doc_add_view = function(req, res){
    res.render(
      'docadd',
      {
        form: req.docaddform || {},
        user: req.user,
        title: 'Document Add',
      }
    );
  };

  app.get('/docs', doc_list_get, doc_list_view);
  app.get('/doc/:id', doc_get, doc_view);
  app.get('/doc-add', doc_add_view);
  app.post('/doc-add', doc_add, doc_add_view);
}
