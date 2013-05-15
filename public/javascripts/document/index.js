(function() {

  var page = new Page('documents');


  page.drow = function(title, docs) {
    console.log('Drow: ', docs);     
    var $page = page.getEl();
   
    $page.find('[name=title]').text(title);

    var $list = $page.find('[name=docs]').empty();

    var l = docs.length;
    for (var i = 0; i < l; ++i) {
     $(Templates['doc/document-in-list'](docs[i])).appendTo($list);
    }
  }

  router.route('/document', function(){
    console.log('!!!!!!!!!!!!');
    api.get('document', {}, function(err, data) {
      if (err) alert("Some error: ", err)
      else page.drow('Последние', data);
    });
    page.show();
  });


  router.route('/document/user/:user', function(user){
    api.get('document', {author: user}, function(err, data){
      if (err) alert("Some error: ", err)
      else page.drow('Мои докуметы', data);
    });
    page.show();
  });

})();
