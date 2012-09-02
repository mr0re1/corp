//TODO: Написать комментарии

var util = require('util')
	, fs = require('fs')
	, _set = require('./settings')
	, dp = _set.DescriptionProperties;


String.prototype.chomp = function() {
//		TODO: Do It right!!!
		return this.replace(/^\s+/, '').replace(/\s+$/, '');		
}

var parseDescription = function(str) {
 var descriptons = str.split('|');
 var d_arr = [];
 for (var d_ind in descriptons) {
	var d_s = descriptons[d_ind];
	var d = {};
	props = d_s.split(/=|,/);
	for (var p_ind in props) {
		var prop = props[p_ind].chomp();
		if (! prop) continue;
		var is_spec = false;
		if(/(.+)\((.+)\)/.test(prop)) { // 'first' and 'lit'
			d.first = RegExp.$1;
			d.lit = RegExp.$2;
			is_spec = true;
		}
		for (var prop_name in dp) {
			if (prop in dp[prop_name]) {
				if (d[prop_name] !== undefined) console.error('REWRITE PROPERTY "%s" in description "%s"', prop_name, d_s);
				d[prop_name] = dp[prop_name][prop];
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

var topic_re = /^#(\d+)/;
var isTopic = function(s) {
	return  (topic_re.test(s)) ? [ {_type: 'topic', type: RegExp.$1, _content: []} , RegExp.rightContext ] : null ;
}

var genre_re = /^@(\d+)/;
var isGenre = function(s) {
	return (genre_re.test(s)) ? [ {_type: 'genre', type: RegExp.$1, _content: []}, RegExp.rightContext ] : null;
}

var lex_re = /^([а-я,ё,\-,\+]+?)\s*\{(.*?)\}/i;
var isLex = function(s) {
	if (lex_re.test(s)) {
		var right = RegExp.rightContext;
		var lex = constructLexem(RegExp.$1, RegExp.$2);
		if (lex) return [lex, right];
	}
 	return null;
}

var ques_re = /^%(.+?)%/;
var isQues = function(s) {
	return (ques_re.test(s)) ? [ {_type: 'ques', text: RegExp.$1 }, RegExp.rightContext ] : null;
}

var processString = function(str, clb) {
	var res = [];
	
	var current_plain_text = "";
	while (str.length) {
		var tmp = isTopic(str) || isGenre(str) || isLex(str) || isQues(str);
		if (tmp) {
			if (current_plain_text.length) {
				res.push(current_plain_text);
				current_plain_text = "";
			}
			res.push(tmp[0]);
			str = tmp[1];
		} else {
			current_plain_text = current_plain_text + str[0];
			str = str.substring(1);
		}
	}
	if (current_plain_text.length) {
		res.push(current_plain_text);
		current_plain_text = "";
	}
	
	
	var doc = {
		_type : 'doc',
		_content : [],
	};
	
	var node = doc;
	var saved_genre_type;
	for (var i = 0; i < res.length; ++i) {
		var item = res[i];
		if (typeof item == 'string' || item._type == 'lex' || item._type == 'ques') {
				node._content.push(item);
				continue;
		}
		if (item._type == 'topic') {
				if (node._type == 'doc') { //Open new topic
						item._parent = node;
						node._content.push(item);
						node = item;
						//Если от родителя достался жанр, вставляем его
						if (saved_genre_type !== undefined) {
								var item = {_type:'genre', type:saved_genre_type, _parent:node, _content:[]}; //Создаем
								saved_genre_type = undefined;
								node._content.push(item);
								node = item;								
						}
						continue;
				}
				if (node._type == 'topic') { //Try to close topic
						if (item.type != node.type) return clb('Try to open new topic without close old'); // Пытаемся открыть новый топик, не закрыв старый
						var p = node._parent;
						delete node._parent; //Чистим за собой
						node = p; //Поднимаемся вверх
						continue;
				}
				if (node._type == 'genre') { //Пытаемся закрыть/открыть(проверяется потом) топик не выйдя из жанра
						//Закрываем жанри сохраняем его
						saved_genre_type = node.type;
						var p = node._parent; 
						delete node._parent;
						node = p;
						i--;   //Пытаемся обработать текущий item еще раз. В JS нет redo ?!
						continue;
				}
		}
		if (item._type == 'genre') {
				if (node._type == 'doc') return clb('Try to open genre not in topic'); //
				if (node._type == 'topic') { //Открываем жанр
						item._parent = node;
						node._content.push(item);
						node = item;
						continue;
				}
				if (node._type == 'genre') {
						if (item.type != node.type) return clb('Try to open new genre without close old'); // Пытаемся открыть новый жанр, не закрыв старый
						
						var p = node._parent;
						delete node._parent;
						node = p;
						continue;
				}
		}
		return clb({message: 'Invalid item type', item:item, node:node});
	}
	if (node._type != 'doc') return clb('Не закрыли ноду!!!!');
	delete doc._type;
	clb(null, doc);
}

var processFile = function(path, clb) {
	fs.readFile(path, 'utf-8', function(err, cont){
		if (err) return clb(err);
		processString(cont, clb);
	});
}


exports.processString = processString;
exports.processFile = processFile;

//Test by Fille
//processFile(process.argv[2], function(err, doc){
//	if (err) console.error(err);
//	//else console.log(util.inspect(doc, false, 4));
//	else {
//		doc._name = process.argv[3] || process.argv[2];
//		console.log(JSON.stringify(doc));
//	}
//});


//Test by String
//var str = ' #12@1 %А вот раньше было, там не разрешали крест носить и вообще веровать – как тогда было?% а{а(а)=CONJ} всё+равно{всё равно(всё равно)=IDIOM}//';
//var tmp = processString(str, function(err, doc) {
//	if (err) console.error(err);
//	else console.log(util.inspect(doc, false, null, true));
//});



