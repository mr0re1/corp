var path = require('path');

module.exports = function(app) {
  var dc = app.document_controller,
      __ = '/api/';

  app.get(__+'document', function(req, res) {
    var q = req.query;
    dc.getDocs(q, function(err, docs){
        if (err) res.send(500, err);
        else res.send(200, docs);
    });
  });

  app.get(__+'document/:id', function(req, res){
    dc.getDoc(req.params.id, function(err, doc){
      if (err) {
        var err_code = 400;
        //TODO: Classify error code
        res.send(err_code, err);
      } else res.send(200, doc)
    })
  });

  app.post(__+'document', function(req, res){
    var b = req.body;
    b.user = req.user;
    dc.loadDocument(
      b
    , function(err, id){
        if (err) {
          var err_code = 400;
          //TODO: Classify error
          res.send(err_code, err);
        }
        else res.send(200, { _id: id });
      });
  });
  
  //TODO: move track methods into API
  var track_add = function(req, res, next) {
    if(! req.files || ! req.files.file) next(new Error("No file!"));
    else {
      var target_path = '/audio/' + path.basename(req.files.file.path)
        , name = req.files.file.name;
        
      dc.fm.upload(req.files.file.path, target_path, function(err){
        if (err) next(err)
        else res.json( {Status: 'OK', name: name, path: target_path } );
      });
    }
  };
  
  var track_remove = function(req, res, next) {
    if (! req.body.path) return next(new Error("Need track path"));
    //TODO: Check permissions
    dc.fm.rm(req.body.path, function(err) {
      if (err) next(err)
      else res.json({Status: 'OK'});
    });
  };

  app.post('/track-add', track_add);
  app.post('/track-remove', track_remove);
  
}
