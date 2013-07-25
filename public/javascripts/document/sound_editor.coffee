class DocumentAudioEditor
  constructor: (@$place)->
    @view = new DocumentView()
    @$view_place = $ '.view', @$place
    @$tablink = $ "a[data-target=##{ @$place[0].id }]"

    @$markers = $ '.markerslist', @$place

    @$load_btn = $ 'button[name=load]', @$place
    @$load_input = $ 'input:file[name=audio]', @$place

    @audio = $('audio', @$place)[0]

    @complexAudio = new ComplexAudio @audio
    @complexAudio.appendTo $ '.complex-audio-wrap', @$place

    @$tablink.on 'shown', @redraw
    @$load_btn.on 'click', => @$load_input.click()
    @$load_input.on 'change', @__on_file_input_change

    @complexAudio.on 'newfragment', @__on_new_fragment

    @$markers.on 'hover', '.marker', @__on_marker_hover

  setDocument: (@document)->
    @document.audio ?= {
      markers: []
      src: null
    }

    @document.on 'contentchange', @redraw


  redraw: =>
    if @$place.is(':visible')
      @view.show(@document, @$view_place)

  __on_file_input_change: =>
    file = @$load_input[0].files[0]
    return if not file?
    @__set_audio_src URL.createObjectURL(file);

  __set_audio_src: (url) ->
    @document.audio.src = @audio.src = url

  __on_new_fragment: (fragment) =>
    @$markers.append("<li>------</li>")

  __on_marker_hover: (e)=>


window.DocumentAudioEditor = DocumentAudioEditor