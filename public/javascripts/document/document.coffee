class Document extends Emitter
  constructor: (doc)->
    super()
    if doc?
      for key, value of doc
        this[key] = value
    else
      console.log 'New document construct'

  setContent: (content)->
    return true if content is @content
    @content = content
    @emit('contentchange', content)

  setMeta: (meta)->
    return true if meta is @meta
    @meta = meta
    @emit('metachange', meta)

  save: ()->
    console.log 'Try to save'




window.Document = Document
