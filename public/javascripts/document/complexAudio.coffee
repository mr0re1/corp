class ComplexAudio extends Emitter
  constructor: (@audio)->
    super()
    @fragments = []

    $(@audio).prop 'controls', false #Disable native control
    $(@audio).hide()

    #Construct new control
    @$control = $('<div>').addClass 'ComplexAudio'
    @$line = $('<div>').addClass('line').appendTo(@$control)
    @$markers = $('<pl>').addClass('markers').appendTo(@$line)

    #Set event handlers
    @$control.on 'dblclick', @__addFragmentClick

  appendTo:($to)->
    @$control.appendTo($to);

  addFragment: (time)->
    fragment = new ComplexAudioFragment(this, time)
    @fragments.push fragment
    @emit('newfragment', fragment)

  pause: ()->
    @audio.pause()

  play: (time, fragment)->
    for fr in @fragments
      fr.setState(false) if fr isnt fragment
    if not (time is null)
      @audio.currentTime = time
    @audio.play()


  __addFragmentClick: (e)=>
    offset_px = @__getOffsetX(e.clientX)
    return false if offset_px is null

    @addFragment @__getOffsetTime offset_px

  __getOffsetPercentByTime: (time) ->
    (time / @audio.duration) * 100

  __getOffsetPercentByX: (x)-> (x / @$line.width()) * 100

  __getTimeByPercent: (p)-> p * @audio.duration / 100

  __getOffsetTime: (x)->
    length = @$line.width()
    duration = @audio.duration

    duration * (x / length)

  __getOffsetX: (x)->
    left_x = @$line[0].offsetLeft
    right_x = left_x + @$line.width()

    if x < left_x or x > right_x
      null
    else
      x - left_x


class ComplexAudioFragment
  constructor: (@parent, @time)->
    @$marker = $('<div>').addClass('marker')
                .appendTo(@parent.$markers)
    @$control = $('<div>').addClass('control').appendTo(@$marker)
    @$dragger = $('<div>').addClass('dragger').appendTo(@$marker)

    @setTime(@time)
    @setState(false)

    @$control.on 'click', @__onControlClick
    @$dragger.on 'mousedown', @__onDraggerMouseDown

  setState: (@state)->
    @$control.toggleClass 'play', @state

  setTime: (@time)->
    @__setOffset @parent.__getOffsetPercentByTime @time
    @parent.play @time if @state

  __setOffset: (percent)->
    @$marker.css('left', percent + '%')

  __onDraggerMouseDown: ()=>
    mousemove = (e)=>
      x = @parent.__getOffsetX(e.clientX)
      return false if x is null
      @__setOffset @parent.__getOffsetPercentByX x

    mouseup = (e)=>
      $(document).off('mousemove', mousemove)
      $(document).off('mouseup', mouseup)
      x = @parent.__getOffsetX(e.clientX)
      p = @parent.__getOffsetPercentByX x
      t = @parent.__getTimeByPercent p
      @setTime(t)

    $(document).on 'mousemove', mousemove
    $(document).on 'mouseup', mouseup

    false

  __onControlClick: ()=>
    @setState not @state
    if @state
      @parent.play @time, this
    else
      @parent.pause()





window.ComplexAudio = ComplexAudio
