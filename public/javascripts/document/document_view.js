(function(){

var page = new Page('document_view');

var $page = page.getEl()
  , $name = $page.find('[name=name]')
  , $cont = $page.find('[name=content]')
  , $desc = $page.find();



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
var get_tmpl = function(item) {
  if ('string' == typeof item) return Templates['doc/plain-text'];
  return Templates['doc/' + item._type];
};

var LexemeRegExp = /l(.*){(.*)}/;
var drowLexem = function(it){
  if (typeof it != 'string' || it.charAt(0) != 'l') return;
  var v = LexemeRegExp.exec(it);
  return Templates['doc/lex']({name: v[1], descr: v[2]});
};
var drowPlainText = function(it){
  if (typeof it != 'string' || it.charAt(0) != 'p') return;
  var str = it.slice(1);
  str = str.replace('\n', '<br>');
  str = str.replace('\s', '&nbsp');
  return Templates['doc/plain-text']({item: str});
};
var drowTheme = function(it){
  if (it._type == 'theme') return Templates['doc/theme'](it);
};
var drowGenre = function(it){
  if (it._type == 'genre') return Templates['doc/genre'](it);
};
var drowQues = function(it){
  if (it._type == 'ques') return Templates['doc/ques'](it);
}

var drowAudio = function(it){
  if (it._type == 'audio' && page.doc.audio[it.id]) {
    return Templates['doc/audio'](page.doc.audio[it.id]);
  }   
};
var drowLexemSet = function(it){
  if (it._type != 'lex-set') return;
  var descr = [];
  for (var li in it.lexems) {
    var l = LexemeRegExp.exec(it.lexems[li]);
    if(l[2]) descr.push(l[2]);
  }
  return Templates['doc/lex']({name: it.name, descr: descr.join('|')});
};

page.drow = function() {
  $name.text(page.doc.name);
  console.log(page.doc);
  var cl = page.doc.content.length
    , item
    , tmpl;
  for (var i = 0; i < cl; ++i) {
    it = page.doc.content[i];
    var html = drowLexem(it) 
             || drowPlainText(it) 
             || drowTheme(it) 
             || drowGenre(it)
             || drowQues(it)
             || drowAudio(it)
             || drowLexemSet(it);
    if (html) $cont.append(html);
  }

  $cont.find('audio').bind({
    'play': function(){ $cont.trigger('audio_play', {path: $(this).attr('src')})}
  , 'pause': function(){ $cont.trigger('audio_pause', {path: $(this).attr('src')})}
  });
};

router.route('/document/view/:id', function(id){
  api.get('document/'+id, {}, function(err, doc){
    if (err) alert("Some error: ", err)
    else {
      page.doc = doc;
      page.drow()
    };
  });

  $cont.empty(); 
  page.show();  
});


})();
