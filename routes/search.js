module.exports = function(app) {
  var __ = '/api/';

  app.get(__+'search', function(req, res){
    app.document_controller.search(req.query, function(err, result){
      if(err) {
        var err_code = 400;
        //TODO: Classify error code
        res.send(err_code, err);
      } else res.send(200, result)
    });
  });
}
