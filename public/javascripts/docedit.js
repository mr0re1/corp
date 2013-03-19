$(document).ready(function(){

  var doc = new Document();

  SourceEditor.init( doc, $('#SourceTab'));
  DocPreview.init  ( doc, $('#PreviewTab'));
  AudioMapper.init ( doc, $('#AudioTab'));
  
});

