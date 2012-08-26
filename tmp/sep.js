var util = require('util')
	, fs = require('fs');

String.prototype.chomp = function () {
	return this.replace(/(\n|\r)+$/, '');
};

var parseDescription = function(str) {
	
	var _P = {
		'type' : { 'S':1,'A':1,'NUM':1,'V':1,'ADV':1,'PRAEDIC':1,'PARENTH':1,'PR':1,'CONJ':1,'PART':1,'INTJ':1,'IDIOM':1,},
		'gender':{'муж':1,'жен':1,'сред':1,},
		'number':{'ед':1,'мн':1},
		'case' : {'им':1,'род':1,'дат':1,'вин':1,'твор':1,'пр':1},
		'anim' : {'од':1,'неод':1},
		'short': {'кр':1},
		'vid'  : {'сов':1,'несов':1},
		'nakl' : {'изъяв':1,'пов':1},
		'time' : {'прош':1,'непрош':1,'наст':1},
		'face' : {'1-л':1,'2-л':1,'3-л':1},
		'inf'  : {'инф':1},
		'participle' : {'прич':1},
		'voice': {'страд':1},
		'gerund':{'деепр':1},
		'imyaS': {'имя':1,'фам':1,'отч':1,'топ':1,'мтоп':1,'прозв':1,'клич':1,'onim':1},
		'dial' : {'*':1},
	}
 
	
 var descriptons = str.split('|');
 var d_arr = [];
 for (var d_ind in descriptons) {
	var d_s = descriptons[d_ind];
	var d = {};
	props = d_s.split(/=|,/);
	for (var p_ind in props) {
		var prop = props[p_ind];
		var is_spec = false;
		if(/(.+)\((.+)\)/.test(prop)) { // 'first' and 'lit'
			d.first = RegExp.$1;
			d.lit = RegExp.$2;
			is_spec = true;
		}
		for (var prop_name in _P) {
			if (prop in _P[prop_name]) {
				if (d[prop_name] !== undefined) console.error('REWRITE PROPERTY "%s" in description "%s"', prop_name, d_s);
				d[prop_name] = prop;
				is_spec = true;
			}
		}
		if (! is_spec) {
			console.error('CAN\'T SPECIFICATE PROPERTY "%s" in description "%s"', prop, d_s);
		}
	}
	d_arr.push(d);
 }
 if (d_arr.length) {
	if (d_arr.length == 1) return d_arr[0]; // Single description
	else return d_arr; //Multi description
 }
 return undefined; // Empty or invalid description
}

var constructLexem = function(word, descr) {
	var lex = {
		_type: 'lex',
		name: word,
		descr: parseDescription(descr),
	};
	return lex;
}

var constructPlainText = function(word) {
	return word;
}

var getLexemes  = function(str) {
	var s = str.chomp().replace(/(\}|\s)/gi, "$1$");
	var arr = s.split('$');
	var res = [];
	arr.forEach(function(_lex){
		var lex = _lex.chomp();
		if (! lex.length) return true;
		if(/^(.*)\{(.*)\}$/.test(lex)){
			var l = constructLexem(RegExp.$1, RegExp.$2);
			if (l) res.push(l);
		} else {
			var sep = constructPlainText(lex);
			if (sep) res.push(sep);
		}
	});
	return res;
}

var getQuestion = function(str) {
	s = str.chomp();
	if ( /^%(.+)%$/.test(s) )
		return {_type: 'ques', text: RegExp.$1.chomp() }
	else
		return undefined;
}


fs.readFile('zrazm.txt', 'utf-8', function(err, data) {
	if (err) throw err;
	var doc = {
		_content: [
			{
				_type: 'topic',
				type: '5',
				_content: [
					{
						_type: 'genre',
						type: '1',
						_content: [	],
					}
				]
			}
		]
	};
	var addTo = doc._content[0]._content[0]._content;
	
	var lines = data.split('\r\n');
	for (var l_ind in lines) {
		var line = lines[l_ind].chomp();
		var q = getQuestion(line);
		if (q) 
			addTo.push(q);
		else {
			var lexs = getLexemes(line);
			for (var lex_ind in lexs) addTo.push(lexs[lex_ind]);
		}
	}
	console.log(util.inspect(doc,false, null));
});