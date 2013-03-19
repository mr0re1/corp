module.exports = function(app) {

  var search = function(req, res, next) {
    var form = req.body;
    form.user = req.user;
     
    app.document_controller.search(form, function(docs){
      res.docs = docs;
      next();
    }.cf(next));
  }
  
  var search_view = function(req, res) {
    res.render(
      'search',
      {
        form: req.searchform || {},
        user: req.user, 
        title: 'Search',
        docs: res.docs || [],
      }
    );  
  }

  app.get('/search', search_view);
  app.post('/search', search, search_view);
}
