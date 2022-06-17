// import * as EditorCompletion from '../EditorCompletion/EditorCompletion.js'
import * as Editor from '../Editor/Editor.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'
import * as EditorCommandCompletion from './EditorCommandCompletion.js'
import * as ExtensionHostBraceCompletion from '../ExtensionHost/ExtensionHostBraceCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Languages from '../Languages/Languages.js'
import * as ExtensionHostClosingTag from '../ExtensionHost/ExtensionHostClosingTagCompletion.js'

const RE_CHARACTER = new RegExp(/^\p{L}/, 'u')

export const state = {
  listeners: [],
}

const getMatchingClosingBrace = (brace) => {
  switch (brace) {
    case '{':
      return '}'
    case '(':
      return ')'
    case '[':
      return ']'
    default:
      return '???'
  }
}

const isBrace = (text) => {
  if (text.length !== 1) {
    return false
  }
  switch (text) {
    case '{':
    case '(':
    case '[':
      return true
    default:
      return false
  }
}

const isSlash = (text) => {
  return text === '/'
}

const editorTypeWithBraceCompletion = async (editor, text) => {
  if (!Languages.state.loaded) {
    await Languages.waitForLoad()
  }
  editor.languageId = Languages.getLanguageId(editor.uri) // TODO avoid side effect here

  const offset = TextDocument.offsetAt(editor, editor.cursor)
  const result =
    await ExtensionHostBraceCompletion.executeBraceCompletionProvider(
      editor,
      offset,
      text
    )
  if (result) {
    const closingBrace = getMatchingClosingBrace(text)
    const insertText = text + closingBrace
    const changes = editorReplaceSelections(editor, [insertText], 'editorType')
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  }
  const changes = editorReplaceSelections(editor, [text], 'editorType')
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

const editorTypeWithSlashCompletion = async (editor, text) => {
  if (!Languages.state.loaded) {
    await Languages.waitForLoad()
  }
  editor.languageId = Languages.getLanguageId(editor.uri) // TODO avoid side effect here

  const offset = TextDocument.offsetAt(editor, editor.cursor)
  const result = await ExtensionHostClosingTag.executeClosingTagProvider(
    editor,
    offset,
    text
  )
  const changes = editorReplaceSelections(editor, [text], 'editorType')
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

export const editorType = async (editor, text) => {
  if (isBrace(text)) {
    return editorTypeWithBraceCompletion(editor, text)
  }
  if (isSlash(text)) {
    return editorTypeWithSlashCompletion(editor, text)
  }
  const changes = editorReplaceSelections(editor, [text], 'editorType')
  // // TODO trigger characters should be monomorph -> then skip this check
  // if (
  //   editor.completionTriggerCharacters &&
  //   editor.completionTriggerCharacters.includes(text)
  // ) {
  //   Command.execute(/* EditorCompletion.openFromType */ 988)
  // }

  // TODO should editor type command know about editor completion? -> no
  EditorCommandCompletion.openFromType(editor, text)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

export const onDidType = (listener) => {
  state.listeners.push(listener)
  // TODO unregister
}
