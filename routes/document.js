var dateFormat = function(date) {
  if (! date) return "";
  return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}

module.exports = function(app) {

  var doc_list_get = function(req, res, next) {
    app.document_controller.getDocs({}, function(docs){
      res.docs = docs;
      next();
    }.cf(next));
  };
  
  var doc_get = function(req, res, next) {
    app.document_controller.getDoc(req.params.id, function(doc){
      res.doc = doc; 
      next();
    }.cf(next));
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
