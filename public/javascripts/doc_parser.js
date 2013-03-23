window.CorpParser = (function () { 


var parseDescription = function(str) {
 var descriptions = str.split('|');
 var d_arr = [];
 for (var d_ind in descriptions) {
  var d_s = descriptions[d_ind];
  var d = {};
  props = d_s.split(/=|,/);
  for (var p_ind in props) {
    var prop = props[p_ind].replace(/(\n|\r)+$/, '');
    if (! prop) continue;
    if(/(.+)\((.+)\)/.test(prop)) { // 'first' and 'lit'
      d.first = RegExp.$1;
      d.lit = RegExp.$2;
    } else { d[prop] = true }
  }
  d_arr.push(d);
 }

 return d_arr; 
}

var constructLexem = function(word, descr) {
  var d = parseDescription(descr);
  if (d.length == 1) {
    d[0].name = word;
    return {
      _type: 'lex'
    , name: word
    , descr: d[0] 
    };
  } else {
    var l_set = {
      _type: 'lex-set'
    , name: word
    , lexems: []
    };
    for (var i = 0; i < d.length; ++i) {
      d[i].name = word;
      l_set.lexems.push(
        {
          _type: 'lex'
        , name: word
        , descr: d[i]
        }
      );
    }
    return l_set;
  }
}

var theme_re = /^#(\d+)/;
var isTheme = function(s) {
  return  (theme_re.test(s)) ? [ {_type: 'theme', type: RegExp.$1} , RegExp.rightContext ] : null ;
}

var genre_re = /^@(\d+)/;
var isGenre = function(s) {
  return (genre_re.test(s)) ? [ {_type: 'genre', type: RegExp.$1}, RegExp.rightContext ] : null;
}

var lex_re = /^([а-я,ё,\-,\+]+?)\s*\{(.*?)\}/i;
var isLexem = function(s) {
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

var audio_re = /^&(\d+)/;
var isAudio = function(s) {
	return (audio_re.test(s)) ? [ {_type: 'audio', id: RegExp.$1}, RegExp.rightContext] : null;
}

var parse = function(str) {
  var content = [];
  
  var start_length = str.length
    , current_plain_text = ""
    , current_theme
    , current_genre;
  
  while (str.length) {
    var position = start_length - str.length;
    var item = isLexem(str) || isQues(str) || isGenre(str) || isTheme(str) || isAudio(str);
    if (item) {
      if (current_plain_text.length) {
        content.push(current_plain_text);
        current_plain_text = "";
      }
      if (item[0]._type == 'theme') {
        if (current_theme !== undefined) { // Close theme
          item[0]._open = false;
          current_theme = undefined;
        } else { //Open theme
          item[0]._open = true;
          current_theme = item[0].type;
        }
      }
      if (item[0]._type == 'genre') {
        if (current_genre !== undefined) { // Close genre
          item[0]._open = false;
          current_genre = undefined;
        } else { // Open genre
          item[0]._open = true;
          current_genre = item[0].type;
        }
      }
      content.push(item[0]);
      str = item[1];
    } else {
      current_plain_text = current_plain_text + str[0];
      str = str.substring(1);
    }
  }
  if (current_plain_text.length) content.push(current_plain_text);
  return content;
}

return {'parse': parse};
})(); 


