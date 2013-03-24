(function(){
  var page = new Page('search');

  page.go = function(queryString) {
    router.navigate('/search/'+this.searchType+'/'+queryString);
  }

  var $page = page.getEl();
  var $result = $page.find('[name=result-list]');
  var $zero_result = $page.find('[name=zero-result]');

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
  
  page.searchTypes.ext.prepareQueryString = function() {
    var qp = [];

    this.$params.find('input[type=text]')
      .each(function(){
        var $this = $(this)
          , val = $this.val();
        if (val) qp.push($this.attr('name') + '=' + val);
      })
    
    var flags = [];
    this.$params.find('input[type=checkbox]:checked')
      .each(function(){ flags.push($(this).val()) });    
    if (flags.length) qp.push('flags=' + flags.join(','));
    
    if (qp.length) return qp.join(';')
  }

  page.searchTypes.ext.search = function(qs, fn) {
    //TODO: implement funcion parseQueryString for utils
    var qp = qs.split(';');
    var query = {};
    for (var i in qp) {
      var a = qp[i].split('=')
        , k = a[0]
        , v = a[1];
      if ('name' == k) query[k] = v;
      if ('first' == k) query['descr.'+k] = v;
      if ('lit' == k) query['descr.'+k] = v;
      if ('flags' == k) {
        var flags = v.split(',');
        for (var j in flags)
          query['descr.'+flags[j]] = true;
      }
    }
    api.get('search', query, fn);
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
    var rl = list.length;
    
    if (rl == 0) return $zero_result.removeClass('invisible');
    $zero_result.addClass('invisible');
    
    for(var i = 0; i < rl; i++)
      page.drowDoc(list[i]);
  };
  
  page.drowDoc = function(doc) {
    var $it =  $(Templates['search/result'](doc));
    $result.append($it);
    DocViewPlace($it, doc);
  };

})();
