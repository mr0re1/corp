AudioManager = (function(){
  var it = {};
  
  it.__addButtonHandler = function() {
    
  }

  it.init = function(place, doc, opt) {
   it.track_list = place.find('[name="TrackList"]');
   it.add_button = place.find('[name="AddTrackButton"]');
  }

  return it;
})();
