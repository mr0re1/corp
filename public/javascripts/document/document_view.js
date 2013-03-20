(function(){

var page = new Page('document_view');

var $page = page.getEl()
  , $name = $page.find('[name=name]')
  , $cont = $page.find('[name=content]')
  , $desc = $page.find();

var get_tmpl = function(item) {
  if ('string' == typeof item) return Templates['doc/plain-text'];
  return Templates['doc/' + item._type];
};

var showLexemeDescription = function() {
  var $this = $(this);
  
  var d = JSON.parse($this.attr('descr'));
  if (! $.isArray(d)) d = [d];
  for (var ind in d) { prepDescr(d[ind]); }
  
  var pos = $this.position();
  pos.top += $this.height();
  
  $descr
    .empty()
    .append(Templates['doc/description']({word: $this.text(), descr: d} ))
    .offset(pos)
    .show();
}
$cont.on('click', '.lex', showLexemeDescription)


function getAudioByPath(path) { 
  return $cont.find('audio[src="'+path+'"]')[0] 
};
function getAudioSwitchByPath(path) { 
  return $cont.find('.audio-switch[src="'+path+'"]') 
};

$cont.on('click', '.icon-play.audio-switch', function(){
  getAudioByPath($(this).attr('src')).play(); 
});

$cont.on('click', '.icon-pause.audio-switch', function(){
  getAudioByPath($(this).attr('src')).pause();
});

$cont.on('audio_play', function(e, p) { 
  getAudioSwitchByPath(p.path)
    .removeClass('icon-play icon-pause')
    .addClass('icon-pause');
});
$cont.on('audio_pause', function(e, p){
  getAudioSwitchByPath(p.path)
    .removeClass('icon-play icon-pause')
    .addClass('icon-play');
});

page.drow = function(doc) {
  $name.text(doc.name);

  var cl = doc.content.length
    , item
    , tmpl;
  for (var i = 0; i < cl; ++i) {
    item = doc.content[i];
    item.nom = i;
    tmpl = get_tmpl(item);
    if (tmpl) {
      if (Object === item.constructor) {
        if (item._type == 'audio'){
          if (doc.audio[item.id]) 
            $cont.append(tmpl(doc.audio[item.id]))
        }
        else $cont.append(tmpl(item)) 
      } 
      else {
        var str = item;
        str = str.replace('\n', '<br>');
        str = str.replace('\s', '&nbsp');
        
        $cont.append(tmpl({item: str, nom: i}));
      }
    }
  }

  $cont.find('audio').bind({
    'play': function(){ $cont.trigger('audio_play', {path: $(this).attr('src')})}
  , 'pause': function(){ $cont.trigger('audio_pause', {path: $(this).attr('src')})}
  });
};

router.route('/document/view/:id', function(id){
  api.get('document/'+id, {}, function(err, doc){
    if (err) alert("Some error: ", err)
    else page.drow(doc);
  });

  $cont.empty(); 
  page.show();  
});


})();
