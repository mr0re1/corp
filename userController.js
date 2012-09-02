UserController = function(cp) {
	this.cp = cp
};

UserController.prototype.userGet = function(name, fn) {
	this.cp.findOne({'name': name}, fn);
};

UserController.prototype.userAdd = function(user, fn) {
	if (user.name === undefined) { fn(new Error('Need name')); return }
	var _this = this;
	this.userGet(user.name, function(err, otherUser){
		if (err) { fn(err); return }
		if (otherUser !== null) { fn(new Error("User with this name is already exist")); return; }
		
		user.created_at = new Date();
		_this.cp.insert(user, fn);
		
	});
	
	
};

exports.UserController = UserController;