$(document).ready(function(){
	//Prepare description affix
	var $descr = $('.descr');
	$descr.click(function() { $(this).hide() } )
	//$descr.width($descr.parent().width());

	var prepDescr = function(d) {
		var f = [
			'type', 'gender', 'number', 'case', 'comp',
			'anim', 'short', 'vid', 'nakl',	'time', 'face',
			'inf', 'participle', 'voice', 'gerund', 'imyaS'];
		var h = [];
		for (var ind_f in f) if (f[ind_f] in d) h.push(d[f[ind_f]]);
		d._gramm = h.join(', ');
	}
	
	var descrTmpl = $('#DescriptionTemplate').template();
	var showLexemeDescription = function() {
		var $this = $(this);
		
		var d = JSON.parse($this.attr('descr'));
		if (! $.isArray(d)) d = [d];
		for (var ind in d) { prepDescr(d[ind]); }
		
		var pos = $this.position();
		pos.top += $this.height();
		
		$descr
		.empty()
		.append($.tmpl( descrTmpl, {word: $this.text(), descr: d} ))
		.offset(pos)
		.show();
	}
	
	$('.docview').on('click', '.lex', showLexemeDescription);
	
});