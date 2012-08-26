$(document).ready(function(){
	$('#loginFormSubmit').on('click', function(e){
		e.preventDefault();
		$('#loginForm').submit();
	});	
});
