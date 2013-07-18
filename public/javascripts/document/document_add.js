/*
(function(){

var page = new Page('document_add');

router.route('/document/add', function(){
  page.show();
});


$(document).ready(function(){
  var $page = page.getEl(); //!!!!!!!!!!!!!!!!!!!!!!!



  /*var doc = {
    audio: {}
  };
  
  var f = {
    name: $page.find('[name=name]'),
    source: $page.find('[name=source]'),
    tracklist: $page.find('[name=tracklist]')
  };


  function onSourceChange(){
		var src = f.source.val();
    var cont = CorpParser.parse(src);
		
		doc.source = src;
		doc.content = cont;
		
		updateTrackList();
	};
	f.source.change(onSourceChange);

  
  var submitButton = $page.find('[name=submit]');
  var submitDocument = function() {
    submitButton.prop('disabled', true);
		var res = {};
		res.name = f.name.val();
		res.content = doc.content;
		res.source = doc.source;
		res.audio = {};
		
		$.each(doc.audio, function(id, track){
			if (track.path && track.name) {
        res.audio[id] = {
          id: id,
          path: track.path,
          name: track.name
        }
      }
		});
   
    api.post('document', res,  function(err, resp){
      submitButton.prop('disabled', false);
      if (err) return alert(err); //!!!!!!!!!!!!!!!!!
      else {
        router.navigate('/document/view/' + resp._id);         
      }
    });
  };  
  submitButton.click(submitDocument);
  
  function updateTrackList() {
		var new_tl = {}
			, cont = doc.content;
		for (var i = 0, cl = doc.content.length; i < cl; ++i) 
			if (cont[i]._type == 'audio') new_tl[cont[i].id] = true;

		for (id in new_tl) if (! doc.audio[id]) addTrack(id);
		for (id in doc.audio) if (! new_tl[id]) deleteTrack(id);
		
		rebuildTrackList();
	};

  function rebuildTrackList() {
		f.tracklist.empty();
		$.each(doc.audio, function(id, track){
			var $li = $(Templates['doc/track']({t:track})).appendTo(f.tracklist);
			if (track.uploader && ! track.name) {
				track.uploader.setLabel( $li.find('label.uploader'));
			}
		});
	};

  var addTrack = function(id) {
		var t = {
			id:id,
			uploader: new FileUploader(
				null,
				{
					action: '/track-add',
					onsubmit: function(name) {
						t.name = name.replace(/^.*[\\\/]/, '');
						rebuildTrackList();
						return true
					},
					onload: function(resp) {
						var res = JSON.parse(resp);
						t.uploaded = true;
						t.path = res.path;
						rebuildTrackList();
					}
				})
		};
		doc.audio[id] = t;
	};
  var deleteTrack = function(id) {
		path = doc.audio[id].path;
		delete doc.audio[id];
		if (path) {
			//Send request on remove file from storage
		};
	};
	var removeTrack = function(id) {
		var t = doc.audio[id];
		t.name = t.uploaded = undefined;
		rebuildTrackList();
		
		//Send request on remove file from storage
		$.ajax({
			url: '/track-remove',
			type: 'POST',
			data: {path: t.path}
		});
	};

  f.tracklist.on('click', 'i.icon-remove', function() {
		var id = $(this).closest('[track]').attr('track');
		if (id) removeTrack(id);
	});

   */


  window.DocumentEditPage = function(page_id) {
    DocumentEditPage.superclass.constructor.apply(this, arguments);
    var self = this;

    this.sourceEditor = new DocumentContentEditor($('.source-editor-wrap', this.$page))

    router.route('/document/add', function(){
      self.setDocument(new Document())
      self.show();
    });

  };
  extend(DocumentEditPage, Page);

  DocumentEditPage.prototype.setDocument = function(document) {
    this.sourceEditor.setDocument(document)
  }


