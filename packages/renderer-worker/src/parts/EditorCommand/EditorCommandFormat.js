import * as Editor from '../Editor/Editor.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const format = async (editor) => {
  // Editor.sync(editor)
  // console.log(textDocument)
  // TODO only transfer incremental edits from shared process
  // TODO also format with cursor
  const newContent = await SharedProcess.invoke(
    /* ExtensionHost.format */ 'ExtensionHost.format',
    /* textDocumentId */ editor.textDocument.id
  )
  if (typeof newContent !== 'string') {
    console.warn('something is wrong with format on save', newContent)
    return
  }
  console.log({ newContent })
  // TODO use  incremental edit
  const documentEdits = [
    {
      type: /* replace */ 3,
      text: newContent,
    },
  ]
  Editor.scheduleDocumentAndCursorsSelections(editor, documentEdits)
}
