import * as Editor from '../Editor/Editor.js'
import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

// TODO format should be executed in parallel with saving
// -> fast save, no need to wait for formatting
// -> fast formatting, no need to wait for save

// TODO should format on save when closing/switching editor?

// TODO format with cursor
// TODO should be in editor folder

const onDidSaveEditor = async (editor) => {
  console.log('format', editor)
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

export const hydrate = async () => {
  if (Platform.getPlatform() === 'web') {
  }
  // TODO check preferences if format on save is enabled
  // EditorSave.onDidSave(onDidSaveEditor)
}
