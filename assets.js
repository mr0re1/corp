module.exports = function(app) {
  var rack = require('asset-rack');

  var assets = new rack.AssetRack([
    new rack.JadeAsset({
      url: '/templates.js',
      dirname: __dirname + '/templates'
    }),
    new rack.LessAsset({
      url: '/styles.css',
      filename: __dirname + '/styles/style.less'
    })
  ]);

  app.use(function(req, res, next) {
    res.locals.assets = assets;
    next();
  });

  assets.on('complete', function(){
    app.use(assets);
    console.log('Assets is done!');
  });   
}
