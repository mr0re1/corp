Page = function(page_id) {
  var self = this;

  this.page_id = page_id;
 
  $(document).on('page_show', function(page_id){
    if (page_id == this.page_id) return;
    self.hide();
  });
};

Page.prototype.getEl = function() {  return $('#'+this.page_id); };
Page.prototype.show = function() {
  $(document).trigger('page_show', this.page_id);
  this.getEl().show();
  this.onshow.apply(this, arguments);
  return this;
};
Page.prototype.hide = function() {
  this.getEl().hide();
  return this;
};
Page.prototype.onshow = function() {};




window.api = {
  url: '/api/',
  get: function(url, data, fn) {
    $.ajax({
      type: 'GET',
      url: this.url + url,
      data: data,
      dataType: 'json',
      success: function(resp) { fn(null, resp) },
      error: function(resp, stat, err) { fn(err, resp) }
    });
  },
  post: function(url, data, fn) {
    $.ajax({
      type: 'POST',
      url: this.url + url,
      data: data,
      dataType: 'json',
      success: function(resp) { fn(null, resp) },
      error: function(resp, stat, err) { fn(err, resp) }
    });
  },
};


(function(){
  window.app = {};
  window.router = new Router();
})();

$(document).ready(function() { 
  $(document).trigger('page_show', null);
  router.checkRoutes(History.getState());
});
