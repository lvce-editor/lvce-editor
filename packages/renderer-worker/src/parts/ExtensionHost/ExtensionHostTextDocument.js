import * as TextDocument from '../TextDocument/TextDocument.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'

// TODO instead of sending full document from
// shared process to renderer-worker to shared process
// to extension host, extension host could just read file directly
// or shared process could send extension host file to open
// after sending file to renderer process
export const handleEditorCreate = (editor) => {
  const text = TextDocument.getText(editor)
  return ExtensionHostShared.execute({
    method: ExtensionHostCommandType.TextDocumentSyncFull,
    params: [editor.uri, editor.id, editor.languageId, text],
  })
}

export const handleEditorChange = (editor, changes) => {
  return ExtensionHostShared.execute({
    method: ExtensionHostCommandType.TextDocumentSyncIncremental,
    params: [editor.id, changes],
  })
}

export const handleEditorLanguageChange = (editor) => {
  return ExtensionHostShared.execute({
    method: ExtensionHostCommandType.TextDocumentSetLanguageId,
    params: [editor.id, editor.languageId],
  })
}
