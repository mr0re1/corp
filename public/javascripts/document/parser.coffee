class DocumentSourceParser
  constructor: (@schema)->
  #TODO: Use schema
  #TODO: Make schema
  #TODO: Make regexps multiline
  #TODO: Make class Loger

  theme_re: /^#(\d+)/
  isTheme: ->
    if $ = @stream.match @theme_re then {type: 'theme', type: $[0]}

  genre_re: /^@(\d+)/
  isGenre: ->
    if $ = @stream.match @genre_re then {type: 'genre', type: $[0]}

  ques_re: /^%(.+?)%/
  isQues: ->
    if $ = @stream.match @ques_re then {type: 'ques', text: $[0]}

  lex_re: /^([а-я,ё,\-,\+]+?)\s*\{(.*?)\}/i
  isLex: ->
    if $ = @stream.match @lex_re
      @__lp = {
        type: 'lex'
        name: $[0]
      }
      @parseDescription $[1]
      @__lp


  description_splitter: '|'
  morph_splitter: /\=|\,/
  first_lit_re: /^(.+)\((.+)\)/

  parseDescription: (str)->
    description_strs = str.split @description_splitter
    descriptions = []

    if description_strs.length > 1
      @addWarning 'Multi-values lexem'
      @__lp.type = 'lex-set'
      @__lp.descriptions = []

    for dstr in description_strs
      description = {}
      propertie_strs = dstr.split @morph_splitter
      for propertie_str in propertie_strs
        if not propertie_str?
          @addWarning 'Empty propertie'
          continue

        if @first_lit_re.test propertie_str
          description.first = RegExp.$1
          description.lit   = RegExp.$2
        else
          propertie = @encodePropertie propertie_str
          if propertie?
            description[propertie.key] = propertie.val

      @checkDescription description
      descriptions.push description

    if @__lp.type is 'lex-set'
      @__lp.descriptions = descriptions
    else
      for k, v of descriptions[0]
        @__lp[k] = v


  encodePropertie: (str)->
    if str is 'од'
      @addError("Invalid property #{str}")
    else
      r = {}
      r[str] = true;
      r

  checkDescription: (description)->

  addMessage: (type, message)->
    @log.messages.push {
      line: @stream.line
      pos: @stream.pos
      text: message
      type: type
    }
    @log[type+'s']++

  addError: (message)-> @addMessage 'error', message

  addWarning: (message)-> @addMessage 'warning', message

  parse: (src, document)->
    @log = {
      messages: []
      errors: 0
      warnings: 0
    }

    state =
      genre: null
      theme: null
      plain: ''
    @stream = new Stream src
    content = []

    while not @stream.empty()
      item = @isLex() or @isQues() or @isGenre() or @isTheme()
      if item
        if state.plain.length
          content.push state.plain
          state.plain = ''

        content.push item
      else
        #TODO: chek character
        state.plain += @stream.next()

    if state.plain.length
      content.push state.plain

    {
      content: content
      log: @log
    }


window.DocumentSourceParser = DocumentSourceParser

#This Stream class realase behavioure like CodeMirror Stream
#But this Stream is multiline
class Stream
  constructor: (@str)->
    @line = 0
    @pos = 0
  # TODO: make property __empty to cashe empty()
  # TODO: dont affect string, use regex offset
  match: (pattern, consume = true)->
    return false if not pattern.test(@str)
    if consume
      @__move(RegExp.lastMatch)

    [RegExp.$1, RegExp.$2]

  next: ->
    if @empty() then null
    else
      ch = @str[0]
      @__move ch
      ch

  eat: (p)->
    if not @empty() and @str[0] is p
      ch = @str[0]
      @__move ch
      ch

  peek: ->
    if not @empty() then @str[0]
    else null

  empty: ->
    @str.length is 0


  __move: (str)->
    lines = str.split '\n'
    ll = lines.length - 1
    if ll
      @line += ll
      @pos = 0
    @pos += lines[ll].length

    @str = @str.substring(str.length)













