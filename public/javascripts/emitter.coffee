class Emitter
  constructor: ()->
    @listeners = {}

  on: (event, listener)->
    @listeners[event] = [] if not @listeners[event]?
    @listeners[event].push listener

  off: (event, listener)->
    return false if not @listeners[event]?
    lst = @listeners[event]
    found = []
    for i in [lst.length-1..0]
      found.push i if lst[i] is listener

    return false if not found.length

    for i in found
      lst.splice(i, 1)

    true

  emit: (event, data)->
    return if not @listeners[event]?

    for listener in @listeners[event]
      listener data

window.Emitter = Emitter



