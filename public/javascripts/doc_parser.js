window.CorpParser = (function () { 



var parseDescription = function(str) {
	return {};
 //var descriptions = str.split('|');
 //var d_arr = [];
 //for (var d_ind in descriptions) {
 // var d_s = descriptions[d_ind];
 // var d = {};
 // props = d_s.split(/=|,/);
 // for (var p_ind in props) {
 //   var prop = props[p_ind].chomp();
 //   if (! prop) continue;
 //   var is_spec = false;
 //   if(/(.+)\((.+)\)/.test(prop)) { // 'first' and 'lit'
 //     d.first = RegExp.$1;
 //     d.lit = RegExp.$2;
 //     is_spec = true;
 //   }
 //   for (var prop_name in dp) {
 //     if (prop in dp[prop_name]) {
 //       if (d[prop_name] !== undefined) console.error('REWRITE PROPERTY "%s" in description "%s"', prop_name, d_s);
 //       d[prop_name] = dp[prop_name][prop];
 //       is_spec = true;
 //     }
 //   }
 //   if (! is_spec) {
 //     console.error('CAN\'T SPECIFICATE PROPERTY "%s" in description "%s"', prop, d_s);
 //   }
 // }
 // d_arr.push(d);
 //}
 //if (d_arr.length) {
 // if (d_arr.length == 1) return d_arr[0]; // Single description
 // else return d_arr; //Multi description
 //}
 //return undefined; // Empty or invalid description
}

var constructLexem = function(word, descr) {
  var lex = {
    _type: 'lex',
    name: word,
    descr: parseDescription(descr)
    };
  return lex;
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

var parse = function(str) {
  var content = [];
  
  var start_length = str.length
    , current_plain_text = ""
    , current_theme
    , current_genre;
  
  while (str.length) {
    var position = start_length - str.length;
    var item = isLexem(str) || isQues(str) || isGenre(str) || isTheme(str);
    if (item) {
      if (current_plain_text.length) {
        content.push(current_plain_text);
        current_plain_text = "";
      }
      if (item._type == 'theme') {
        if (current_theme !== undefined) { // Close theme
          if (current_theme != item.type) return (new Error("Try to open new theme without closing old at position " + position));
          item._mark = 'close';
          current_theme = undefined;
        } else { //Open theme
          item._mark = 'open';
          current_theme = item.type;
        }
      }
      if (item._type == 'genre') {
        if (current_genre !== undefined) { // Close genre
          if (current_genre != item.type) return (new Error("Try to open new genre without closing old at position " + position));
          item._mark = 'close';
          current_genre = undefined;
        } else { // Open genre
          item._mark = 'open';
          current_genre = item.type;
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


