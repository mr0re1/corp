var LexemeController = function(cp) {
	this.cp = cp;
}

LexemeController.prototype.addLexemes = function(lexemes, doc_id, fn) {
	if (! lexemes instanceof Array) lexemes = [lexemes];
	var _this = this;
	
	lexemes.forEach(function(lex){
		_this.getLexId(lex, function(id) {
			
		});
	});
}

LexemeController.prototype.getLexId = function(lex, fn) {
	
}

exports.LexemeController = LexemeController;