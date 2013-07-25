class DocumentAudioEditor
  constructor: (@$place)->
    @view = new DocumentView()
    @$view_place = $ '.view', @$place

    '@$place.on 'shown', @onshown

  setDocument: (@document)->
    @document.on 'contentchange', @redraw

  redraw: =>
    @view.show @document, @$view_place

  onshown: =>
    alert 22

window.DocumentAudioEditor = DocumentAudioEditor