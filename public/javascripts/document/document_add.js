(function(){

var page = new Page('document_add');

router.route('/document/add', function(){
  page.show();
});


$(document).ready(function(){
  var $page = page.getEl(); //!!!!!!!!!!!!!!!!!!!!!!!
  
  var doc = {
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

  function setSource(src){ f.source.text(src).change() };

  //check FileAPI is supported
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		$('[name="SourceLoadButton"]').show().change(function(){
			var file = this.files[0]
				, reader = new FileReader();
			
			reader.onload = function() { setSource(reader.result); };
			reader.readAsText(file, 'cp1251');
		});
	}
	else {
		var uploader  = new FileUploader(
			$('[name="SourceLoadLabel"]').show(),
			{
				action: '/returnfilecontent',
				params: {
					encoding: 'cp1251'
				}
			});
		uploader.onload = setSource;
	};

  
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


});



})();
