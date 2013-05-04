var crypto = require('crypto');

UserController = function(cp) {
	this.cp = cp;
  this.crypto_len = 128;
  this.crypto_iterations = 12000;
};

UserController.prototype.userGet = function(name, fn) {
	this.cp.findOne({'name': name}, fn);
};

UserController.prototype.userAdd = function(user, fn) {
	if (user.name === undefined) { fn(new Error('Need name')); return }
	var self = this;
	this.userGet(user.name, function(err, otherUser){
		if (err) return fn(err);
		if (otherUser !== null)  
      return fn(new Error("User with this name is already exist"));
	  
    var pass = user.pass;
    delete user.pass;

    self.calcHash(pass, function(err, hash, salt) {
      if (err) return fn(err);

      user.salt = salt;
      user.hash = hash;
      user.created_at = new Date();

		  self.cp.insert(user, fn);
    })
    
	});
};

UserController.prototype.calcHash = function(pwd, salt, fn) {
  var self = this;
  if (3 == arguments.length) {
      crypto.pbkdf2(pwd, salt, this.crypto_iterations, this.crypto_len, 
        function(err, hash){
          if (err) fn(err);
          else fn(null, hash.toString('binary'), salt);
        }
      );
  } 
  else {
      fn = salt;
      crypto.randomBytes(this.crypto_len, function(err, salt){
          if (err) return fn(err);
          salt = salt.toString('base64');
          self.calcHash(pwd, salt, fn);
      });
  }

}

UserController.prototype.authenticate = function(name, pass, fn) {
  var self = this;
  
  this.userGet(name, function(err, user){
    if (err) return fn(err);
    if (! user) return fn(new Error('cannot find user ' + name));
   
    self.calcHash(pass, user.salt, function(err, hash) {
        if (err) return fn(err);
        if (hash == user.hash) return fn(null, user);
        fn(new Error('invalid password'));
    });
  });
}


exports.UserController = UserController;
