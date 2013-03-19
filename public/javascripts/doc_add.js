$(document).ready(function(){
	
	var doc = {
		audio: {}
	};
	
	var $name = $('[name=document_name]')
    , $source = $('[name=source]')
		, $tracklist = $('.tracklist');
console.log($name);	
	var addTrack = function(id) {
		var t = {
			id:id,
			uploader: new FileUploader(
				null,
				{
					action: '/track-add',
					onsubmit: function(name) {
						t.name = name;
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
	$tracklist.on('click', 'i.icon-remove', function() {
		var id = $(this).closest('[track]').attr('track');
		if (id) removeTrack(id);
	});
	var rebuildTrackList = function() {
		$tracklist.empty();
		$.each(doc.audio, function(id, track){
			var $li = $(Templates['doc/track']({t:track})).appendTo($tracklist);
			if (track.uploader && ! track.name) {
				track.uploader.setLabel( $li.find('label.uploader'));
			}
		});
	}
	
	var updateTrackList = function() {
		var new_tl = {}
			, cont = doc.content;
		for (var i = 0, cl = doc.content.length; i < cl; ++i) 
			if (cont[i]._type == 'audio') new_tl[cont[i].id] = true;

		for (id in new_tl) if (! doc.audio[id]) addTrack(id);
		for (id in doc.audio) if (! new_tl[id]) deleteTrack(id);
		
		rebuildTrackList();
	};
	
	var onSourceChange = function() {
		var src = $source.val();
    var cont = CorpParser.parse(src);
		
		doc.source = src;
		doc.content = cont;
		
		updateTrackList();
	};
	$source.change(onSourceChange);
	
	//check FileAPI is supported
	if (window.File && window.FileReader && window.FileList && window.Blob && 0) {
		$('[name="SourceLoadButton"]').show().change(function(){
			var file = this.files[0]
				, reader = new FileReader();
			
			reader.onload = function() {
				$source.text(reader.result).change();
			};
			reader.readAsText(file, 'cp1251');
		});
	}
	else {
		var uploader  = new FileUploader(
			$('[name="SourceLoadLabel"]'),
			{
				action: '/returnfilecontent',
				params: {
					encoding: 'cp1251'
				}
			});
		uploader.onload = function(content) {
			$source.text(content).change();
		};
	};
	
	var submit = function(doc, fn) {
		$.ajax({
			action: '/doc-add',
			type: 'POST',
			data: {
				doc: doc
			},
      error: function() { fn("Network error: " + arguments[1]); },
      success: function() { fn(null, arguments[0]); }
		});
	};
	
	var submitDocument = function() {
		var res = {};
		res.name = $name.val();
		res.content = doc.content;
		res.source = doc.source;
		res.audio = {};
		
		$.each(doc.audio, function(id, track){
			if (track.path && track.name);
			res.audio[id] = {
				id: id,
				path: track.path,
				name: track.name
			};
		});
    
    submit(res, function(err, res){
      if (err) console.error(err)
      else console.log('OK: ', res);
    })
  };
	
	var onSumbitClickHandler = function(e) { 
    submitDocument();
  };
	$('[name=submit]').click(onSumbitClickHandler);
});
