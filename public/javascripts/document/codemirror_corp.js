CodeMirror.defineMode('russia_dialect', function(){
  function tokenBase(stream, state) {
    if (stream.match(/^#(\d+)/)) return 'theme';
    if (stream.match(/^@(\d+)/)) return 'genre';
    if (stream.match(/^%(.+?)%/))return 'ques';
    if (stream.match(/^([а-я,ё,\-,\+]+?)\s*\{(.*?)\}/i, false)) {
      state.tokens.push(tokenLexHead);
      return tokenize(stream, state);
    }
    var ch = stream.next();
    return 'plain';
  }

  function tokenLexHead(stream, state) {
    stream.match(/^([а-я,ё,\-,\+]+)\s*/i);
    state.tokens.pop();
    state.tokens.push(tokenLexDescription);
    return 'lex-head';
  }

  function tokenLexDescription(stream, state) {
    stream.match(/^\{(.*?)\}/);
    state.tokens.pop();
    return 'lex-description';
  }

  function tokenize(stream, state) {
    var ln = state.tokens.length;

    return (ln ? state.tokens[ln - 1] : tokenBase) (stream, state);
  }
  return {
    startState: function() {
      return {tokens:[]};
    },
    token: tokenize
  }
});