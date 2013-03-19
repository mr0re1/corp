//TODO: add response type: (text/html/json)

FileUploader = function(label, opt) {
	opt = opt || {};
	
	var that = this;
	this.id = FileUploader._createID();
	
	this._createHiddenDiv(opt);
	this._createIFrame(opt);
	this._createForm(opt);
	
	this.onsubmit = opt.onsubmit || function() { return true };
	this.onload = opt.onload || function() {  };
	
	this.input.change( function(e) { that._inputChangeHandler(e) } );
	this.iframe.load( function(e) { that._iframeOnloadHandler(e) } );
	
	if (label) this.setLabel(label, opt);
};

FileUploader.next_id = 1;
FileUploader._createID = function() {
	return 'fileuploader_' + this.next_id++;
};

FileUploader.prototype.setLabel = function(label, opt) {
	if (! label || ! label.is('label')) throw new Error('First argument must be <label>');
	
	this.label = label;
	this.label.attr('for', this.input.attr('id'));
	
	// mozilla won't focus a file input with the click of a corresponding
	// label, but all other browsers do. if we detect mozilla, listen for
	// the label click and send a click to the file input programmatically
	if($.browser.mozilla)
    this.label.click(function() { this.input.click(); });
}

FileUploader.prototype._createHiddenDiv = function() {
	var $d = $('<div>')
		.css({
			width: 0,
			height: 0,
			overflow: 'hidden' })
		.appendTo('body');
	this.hidden_div = $d;
};

FileUploader.prototype._createForm = function(opt) {
	var $form = $('<form>')
		.appendTo(this.hidden_div)
		.attr({
			target: this.id,
			method: 'POST',
			action: opt.action,
			enctype: "multipart/form-data"
		});
	var $inp = $('<input type="file" name="file" id="'+this.id+'_fileinput"/>').appendTo($form);
	
	var params = opt.params || {};
	
	for (var k in params) 
		$form.append('<input type="hidden" name="'+k+'" value="'+params[k]+'">');
	
	
	this.form = $form;
	this.input = $inp;
};

FileUploader.prototype._createIFrame = function() {
	var $iframe = $('<iframe id="'+this.id+'" name="'+this.id+'">').appendTo(this.hidden_div);
	this.iframe = $iframe;
};

FileUploader.prototype.destructor = function() {
	this.hidden_div.remove();
};

FileUploader.prototype._inputChangeHandler = function(e) {
	var path = this.input.val();
	if (! path) return; //No file is selected
	if (! this.onsubmit(path)) return;
	
	this._on_upload = true;
	this.form.submit();
	
};

FileUploader.prototype._iframeOnloadHandler = function() {
	this._on_upload = false;
	this.onload(getFrameContents(this.iframe[0]));
};

function getFrameContents(iFrame){
   var iFrameBody;
   if ( iFrame.contentDocument ) 
   { // FF
     iFrameBody = iFrame.contentDocument.getElementsByTagName('body')[0];
   }
   else if ( iFrame.contentWindow ) 
   { // IE
     iFrameBody = iFrame.contentWindow.document.getElementsByTagName('body')[0];
   }
   return iFrameBody.innerText;
 };
