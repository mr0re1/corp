class DocumentEditPage extends Page
  constructor: (@page_id)->
    super @page_id

    @sourceEditor = new DocumentContentEditor(
      $ '#document_edit-editor-content'
      new DocumentSourceParser()
    )

    @audioEditor = new DocumentAudioEditor $ '#document_edit-editor-audio'


    router.route '/document/add', ()=>
      @setDocument new Document()
      @show()

  setDocument: (@document)->
    @sourceEditor.setDocument @document
    @audioEditor.setDocument @document

window.DocumentEditPage = DocumentEditPage