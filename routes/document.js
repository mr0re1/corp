module.exports = function(app) {

  var doc_list_getter = function(criteria) {
    criteria = criteria || {};
    return function(req, res, next) {
      var c = (typeof criteria == 'function') ? criteria(req) : criteria;
      app.document_controller.getDocs(c, function(docs){
        res.locals.docs = docs;
        next();
      }.cf(next));
    };
  };
    
  var doc_get = function(req, res, next) {
    app.document_controller.getDoc(req.params.id, function(doc){
      res.locals.doc = doc; 
      next();
    }.cf(next));
  };
 
  var doc_add =  function(req, res, next) {
    var form = req.body;
    form.user = req.user;
    form.files = req.files;

    app.document_controller.loadDocument(
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

  var doc_remove = function(req, res, next) {
    app.document_controller.removeDocument(req.params.id, next)
  };
  
  var doc_public = function(req, res, next) {
    app.document_controller.publicDocument(req.params.id, next)
  };
  var doc_unpublic = function(req, res, next) {
    app.document_controller.unpublicDocument(req.params.id, next)
  };
  
  var redirect_back = function(req, res) {
    res.redirect('back');
  };

  var res_render = function(template, opt) {
    return function(req, res) { res.render(template, opt) };
  };

  app.get( '/docs', doc_list_getter({'public': true}), res_render('docs'));
  app.get('/my/docs', 
          doc_list_getter(function(req){ return {author: req.user} }), 
          res_render('my_docs'));
  app.get('/doc/:id', doc_get, res_render('doc'));
  
  app.post('/doc-remove/:id', doc_remove, redirect_back);
  app.post('/doc-public/:id', doc_public, redirect_back);
  app.post('/doc-unpublic/:id', doc_unpublic, redirect_back);
  
  app.get('/doc-edit', 
          function(q, r, n) {r.locals.doc = {}; n()},  
          res_render('docedit'));
  app.get('/doc-edit/:id', doc_get, res_render('docedit'));



}
