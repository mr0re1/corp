
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render(
    'index',
    {
      user: req.session.user,
      title: 'Express',
      
    });
};

exports.docs = function(req, res){
  res.render(
    'docs',
    {
      user: req.session.user,
      title: 'Documents',
      docs: res.docs,
    }
  );
};

exports.doc = function(req, res){
  console.log(res.doc);
  res.render(
    'doc',
    {
      user: req.session.user,
      title: 'Document view',
      doc: res.doc,
    }
  );
}