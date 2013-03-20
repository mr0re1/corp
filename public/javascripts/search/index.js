(function(){
  var page = new Page('search');

  page.go = function(queryString) {
    router.navigate('/search/'+this.searchType+'/'+queryString);
  }

  var $page = page.getEl();
  var $result = $page.find('[name=result-list]');

  var SearchType = function(name) {
    var self = this;
    this.name = name;
    this.$params = $page.find('[name='+name+'-params]');
    this.$submit = this.$params.find('button[name=submit]');

    this.$submit.click(function(){ 
      var sq = self.prepareQueryString();
      if (sq) page.go(sq);
    });

  };
  SearchType.prototype.show = function() { this.$params.show(); };
  SearchType.prototype.hide = function() { this.$params.hide(); };
  SearchType.prototype.prepareQueryString = function() { 
    console.error("Method not implemented in ", this);
  };
  SearchType.prototype.search = function() { 
    console.error("Method not implemented in ", this);
  };

  page.searchTypes = {
    std: new SearchType('std')
  , ext: new SearchType('ext')
  };

  page.searchTypes.std.prepareQueryString = function() {
    var w = this.$params.find('input[name="word"]').val();
    return w;
  };
  page.searchTypes.std.search = function(word, fn) {
    api.get('search', {name: word}, fn);
  }

  page.setSearchType = function(type) {
    if (! type in this.searchTypes) 
      return console.error('Invalid search type', type);
    if (this.searchType == type) return;
    for (var t in this.searchTypes) 
      this.searchTypes[t][(t == type)? 'show': 'hide']();
    this.searchType = type;
  };

  page.search = function(params){
    this.searchTypes[this.searchType].search(params, page.drow)  
  };

  
  router.route('/search*dummy', function(){ page.show(); });

  router.route('/search/:type*dummy', function(type){ page.setSearchType(type); });

  router.route('/search/:type/*params', function(type, params){ page.search(params); }); 
  //Set default search type:
  page.setSearchType('std');


  //TODO: make document view module for using it in document-view and search results
  page.drow = function(err, list){
    $result.empty();
    var rl = list.length
      , tmpl = Templates['search/result'];
    for(var i = 0; i < rl; i++) {
      $result.append(tmpl(list[i])); 
    }
  };


})();
