SourceEditor = (function(){
  var it = {};
  
  it.__loadSourceHandler = function() {
    var file = it.load_button[0].files[0];
    var reader = new FileReader();
    
    reader.onload = function() {
      it.source_textarea.text(reader.result);
      it.__sourceTextareaChangeHandler();
    };

    reader.readAsText(file, it.__getEncoding()); 
  };

  it.__encodingCheckBoxHandler = function() {
    if (it.encoding_checkbox.prop('checked'))
      it.encoding_selector.show()
    else 
      it.encoding_selector.hide();
  };

  it.__getEncoding = function() {
    var enc = it.DEFAULT_ENCODING;
    if (it.encoding_checkbox.prop('checked'))
      enc = it.encoding_selector.val() || enc;
    return enc;
  };
  
  it.__sourceTextareaChangeHandler = function() {
    var src = it.source_textarea.val();
    var cont = CorpParser.parse(src);
    it.doc.set('source', src);
    it.doc.set('content', cont);
  };

  it.init = function(doc, place) {
    it.place = place;
    it.doc = doc;
    it.DEFAULT_ENCODING = 'CP-1251';

    it.load_button = place.find('[name="SourceLoadButton"]');
    it.load_button.change(it.__loadSourceHandler);

    it.encoding_checkbox = place.find('[name="SourceEncodingCheckbox"]');
    it.encoding_checkbox.change(it.__encodingCheckBoxHandler);

    it.encoding_selector = place.find('[name="SourceEncodingSelector"]');

    it.source_textarea = place.find('[name="SourceText"]');
    it.source_textarea.change(it.__sourceTextareaChangeHandler);
  };

  return it;
})();


DocPreview = (function(){
  var it = {};
  
  it.__changeContentHandler = function() {
    construct_view(it.doc.get('content'), it.reas_area, {});
  }
  
  it.init = function(doc, place) {
    it.doc = doc;
    it.place = place;
    
    it.reas_area = place.find('[name="Content"]');

    it.doc.on('change:content', it.__changeContentHandler);
  }

  return it;
}());
