class DocumentView
  constructor: (@opt)->
    @opt ?= {}

  show: (document, $place)->

    $place.empty()
    return if ! document.content
    res = []

    for it in document.content
      if typeof it is 'string'
        res.push "<span class='plain'>#{it}</span>"
        continue

      if not it.type? or not JST["templates/doc/#{it.type}"]?
        console.error "Undefined item: ", it
        continue

      res.push JST["templates/doc/#{it.type}"] it

    $place.html res.join ''



window.DocumentView = DocumentView