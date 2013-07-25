class DocumentContentEditor
  constructor: (@$place, @parser)->
    self = this
    @document = null

    @cm = CodeMirror(
      $('.source-editor-wrap', @$place)[0]
      {
        mode: 'russia_dialect'
        lineWrapping: on
        lineNumbers: on
      }
    )

    @$toolbar = $ '.toolbar', @$place
    @$log_wrap = $ '.log-wrap', @$place
    @$log_list = $ '.log-table>tbody', @log_wrap

    #check FileAPI is supported
    if window.File and window.FileReader and window.FileList and window.Blob
      @__initFileUploader()

    @__initToolbar()

    @cm.on 'change', @onSourceChange

    @$log_list.on('click', 'tr', ->
      $this = $ this
      line = parseInt($this.attr 'data-line')
      ch = parseInt($this.attr 'data-ch')

      self.setCursor(line, ch);
      self.cm.focus();
      false
    )

  __initFileUploader: ->
    self = this

    $('button[name=load]', @$toolbar).show()

    $('input:file[name="source-loader"]', @$place).change ()->
      file = @files[0]
      reader = new FileReader()
      reader.onload = ()->  self.setSource reader.result
      reader.readAsText file, 'cp1251'

  __initToolbar: ->
    $('[name=load]', @$toolbar).click ()=>
      $('input:file[name="source-loader"]', @$place).click()

    $('[name=save]', @$toolbar).click @saveToFile


    $('[name=align]', @$toolbar).click ()=>
      alert "Doesn't implemented"

  saveToFile: =>
    blob = new Blob([@getSource()], {type:'text/plain'});
    url = window.URL.createObjectURL(blob);

    $dl = $('<a>').attr('href', url)
    $dl.appendTo('body').text('click')
    console.log $dl

  setSource: (src)->
    @cm.setValue src

  getSource: ->
    @cm.getValue()

  setCursor: (line, ch)->
    d = @cm.getDoc()
    d.setCursor(line, ch, true)

  setDocument: (@document)->
    #@mc.setValue @document.source


  onSourceChange: =>
    data = @parser.parse @cm.getValue(), @document

    @updateLog(data.log) if data.log?
    @document.setContent data.content if data.content?

  updateLog: (log)->
    @$log_list.empty()

    if not log.messages.length
      return @$log_wrap.hide()

    @$log_wrap.show()
    for m in log.messages
      @$log_list.append(JST['templates/doc/log_row'](m));







window.DocumentContentEditor = DocumentContentEditor