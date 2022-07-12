import * as TextDocument from '../TextDocument/TextDocument.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

// TODO instead of sending full document from
// shared process to renderer-worker to shared process
// to extension host, extension host could just read file directly
// or shared process could send extension host file to open
// after sending file to renderer process
export const handleEditorCreate = async (editor) => {
  const text = TextDocument.getText(editor)
  return ExtensionHostShared.execute({
    method: 'ExtensionHostTextDocument.syncFull',
    params: [editor.uri, editor.id, editor.languageId, text],
  })
}

export const handleEditorChange = async (editor, changes) => {
  return ExtensionHostShared.execute({
    method: 'ExtensionHostTextDocument.syncIncremental',
    params: [editor.id, changes],
  })
}

export const handleEditorLanguageChange = async (editor) => {
  return ExtensionHostShared.execute({
    method: 'ExtensionHostTextDocument.setLanguageId',
    params: [editor.id, editor.languageId],
  })
}
