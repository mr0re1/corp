Document = function(doc) {
  doc = doc || {};

  for (var prop in ['content', 'name', 'tracks', 'author', 'created']) 
    this[prop] = doc[prop];
  
  this.listeners = {};
};

Document.prototype.get = function(prop) {
  return this[prop];
}

Document.prototype.set = function(prop, value) {
  this[prop] = value;
  this.emit('change:'+prop, value);
  return this[prop];
}


Document.prototype.getListeners = function(event) {
  this.listeners[event] = this.listeners[event] || [];
  return this.listeners[event];
}
Document.prototype.on = function(event, listener) {
  this.getListeners(event).push(listener);
}

Document.prototype.off = function(event){
  this.listeners[event] = [];
}

Document.prototype.emit = function(event, data) {
  var listeners = this.getListeners(event)
    , llen = listeners.length;
  for (var i = 0; i < llen; ++i) {
    listeners[i].apply(this, [data]);
  }
}
