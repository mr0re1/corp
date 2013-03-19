$(document).ready(function(){
	var process_click = function() {
		
		var $this = $(this);
		var check_src = $this.attr('check');
		if (check_src) {
			var check_fun = new Function(check_src);
			if (! check_fun()) return false;
		}
		
		var method = $this.attr('method') || 'post';
		var path = $this.attr('href');
		
		var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
		
		document.body.appendChild(form);
    form.submit();

		return false;
	};
	
	$(document).on('click', 'a[method]', process_click);
});