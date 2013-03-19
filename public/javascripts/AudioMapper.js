AudioMapper = (function(){

var it = {};

it.addTrack = function(track) {
  tracks.push(track)
};

it.__changeContentHandler = function() {
  construct_view(it.doc.get('content'), it.content_area, {});
  it.__drawMap();
};

it.__addTrackHandler = function() { it.__addTrack({}); }

it.__addTrack = function(track) {
  track.name = track.name ||  'track#' + it.track_counter++;
  track.duration = 0;
  track.src = '';
  track.start = track.end = undefined;
  it.tracks[track.name] = track;

  it.track_list.append(it.track_template(track));
}

it.__onContentClickHandler = function() {
  var $this = $(this);
  var nom = $this.attr('nom');
  console.log(nom, this);
  if (! nom || ! it.__mappingState) return;
  if (it.__mappingState == 'start') it.__setTrackBegin(nom, $this);
  else if (it.__mappingState == 'end') it.__setTrackEnd(nom, $this);
};

it.__setCurrentTrack = function(track) {
  console.log('SetTrack', track);
  if (track === it.__currentTrack) return;
  it.track_list.find('.track').removeClass('current');
  it.__currentTrack = track;
  it.__mappingState = null;
  if (! track) return;
  it.track_list.find('.track[track_name="'+track.name+'"]').addClass('current');
};

it.__setTrackBegin = function(nom, el) {
  it.__currentTrack.start = nom;
  if (it.__currentTrack.start > it.__currentTrack.end)
    it.__currentTrack.end = it.__currentTrack.start;
  it.__stopMapping();
};

it.__setTrackEnd = function(nom, el) {
  it.__currentTrack.end = nom;
  if (it.__currentTrack.end < it.__currentTrack.start)
    it.__currentTrack.start = it.__currentTrack.end;
  it.__stopMapping();
};


it.__trackClickHadler = function() {
  var name = $(this).attr('track_name');
  it.__setCurrentTrack(it.tracks[name]);
};

it.__trackMapHandler = function(type) {
  console.log(type, it.__currentTrack);
};

it.init = function(doc, place, opt) {
  it.place = place;
  it.doc = doc;
  it.tracks = doc.tracks;
  it.tracks = it.tracks || {};
  opt = opt || {};

  it.track_counter = opt.counter || 1;
  
  it.content_area = place.find('[name="Content"]');
  it.doc.on('change:content', it.__changeContentHandler);
  it.content_area.on('click', 
                     '.lex, .plain-text, .theme, .genre, .ques', 
                     it.__onContentClickHandler);


  it.track_list = place.find('[name="TrackList"]');
  it.track_list.on('click', '.track', it.__trackClickHadler);
  it.track_list.on('click', '.start-map-icon', it.__trackMapHandler.bind(null,'start'));
  it.track_list.on('click', '.end-map-icon', it.__trackMapHandler.bind(null,'end'));


  it.add_track_button = place.find('[name="AddTrackButton"]');
  it.add_track_button.click(it.__addTrackHandler);
  it.track_template = Templates['doc/track']; 
};

it.__drawMap = function() {
  var cl = it.doc.content.length + 1
    , i = 0
    , isB = {}, isE = {}
    , m = new Array(cl);
  for(i = 1; i < cl; ++i) m[i] = 0;
  for(var t_n in it.tracks) {
    var t = it.tracks[t_n];
    for (i = t.start; i <= t.end; ++i) {
      m[i]++;
    }
  }
  var item = it.content_area.find('[nom="1"]');
  for (i = 1; i < cl; ++i, item = item.next()) {
    var color = '#faa';
    if (m[i] == 0) color = '#aaa';
    if (m[i] == 1) color = '#afa';

    item.css('background-color', color);
  }
}

return it;
}())
