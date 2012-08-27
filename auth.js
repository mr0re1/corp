var crypto = require('crypto');

var len = 128;
var iterations = 12000;

var calcHash = function(pwd, salt, fn) {
    if (3 == arguments.length) {
        crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
            if (err) return fn(err);
            fn(null, hash, salt);
        });
    } else {
        fn = salt;
        crypto.randomBytes(len, function(err, salt){
            if (err) return fn(err);
            salt = salt.toString('base64');
            return calcHash(pwd, salt, fn);
        });
    }
}

var prepareCollection = function(collection, users) {
    for(var dummy in users) {
        (function(user) {
            calcHash(user.pass, function(err, hash, salt){
                if(err) throw err;
                var _user = {name: user.name, salt: salt, hash: hash};
                collection.insert(_user, {safe: true}, function(err, res) {
                    console.log(arguments);
                    if(err) throw err;
                    console.log(res);
                })
            });    
        })(users[dummy]);
    }
};


var Auth = function(opt) {
    opt = opt || {};
    this.provider = opt.provider;
} 

Auth.prototype.authenticate = function(name, pass, fn) {
    this.provider.userGet(name, function(err, user){
        if (err) return fn(err);
        if (! user) return fn(new Error('cannot find user ' + name));
       
        calcHash(pass, user.salt, function(err, hash) {
            if (err) return fn(err);
            if (hash == user.hash) return fn(null, user);
            fn(new Error('invalid password'));
        })
    });
}

Auth.prototype.login = function(req, res, next) {
    var name = req.body.name;
    var pass = req.body.password;
    
    this.authenticate(name, pass, function(err, user) {
        if (err) return next(err);
        req.session.user = user;
        next();
    });
};

Auth.prototype.logout = function(req, res, next) {
    delete req.session.user;
    next();
}

Auth.prototype.middleware = function(req, res, next) {
    var user = req.session.user;
    
    next();
};

//Auth.prototype._prepareCollection = function(users) {
//    var _this = this;
//    for (var dummy in users) {
//        (function(user){
//            var pass = user.pass;
//            delete user.pass;
//            calcHash(pass, function(err, hash, salt) {
//                if (err) return fn(err);
//                user.hash = hash;
//                user.salt = salt;
//                _this.provider.userAdd(user, function(err, user) {
//                    if (err) console.log(err);
//                })
//            });
//        })(users[dummy]);
//    }
//}

exports.Auth = Auth;
