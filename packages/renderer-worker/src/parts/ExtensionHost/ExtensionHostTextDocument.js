import * as TextDocument from '../TextDocument/TextDocument.js'
import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from '../ExtensionHost/ExtensionHostManagement.js'

// TODO instead of sending full document from
// shared process to renderer-worker to shared process
// to extension host, extension host could just read file directly
// or shared process could send extension host file to open
// after sending file to renderer process
export const handleEditorCreate = async (editor) => {
  await ExtensionHostManagement.ensureExtensionHostIsStarted()
  const text = TextDocument.getText(editor)
  // TODO should use invoke
  await ExtensionHost.invoke(
    /* ExtensionHostTextDocument.syncFull */ 'ExtensionHostTextDocument.syncFull',
    /* uri */ editor.uri,
    /* documentId */ editor.id,
    /* languageId */ editor.languageId,
    /* text */ text
  )
}

export const handleEditorChange = async (editor, changes) => {
  await ExtensionHostManagement.ensureExtensionHostIsStarted()
  await ExtensionHost.invoke(
    /* ExtensionHostTextDocument.syncIncremental */ 'ExtensionHostTextDocument.syncIncremental',
    /* textDocumentId */ editor.id,
    /* changes */ changes
  )
}

export const handleEditorLanguageChange = async (editor) => {
  await ExtensionHostManagement.ensureExtensionHostIsStarted()
  await ExtensionHost.invoke(
    /* ExtensionHostTextDocument.setLanguageId */ 'ExtensionHostTextDocument.setLanguageId',
    /* textDocumentId */ editor.id,
    /* languageId */ editor.languageId
  )
}
