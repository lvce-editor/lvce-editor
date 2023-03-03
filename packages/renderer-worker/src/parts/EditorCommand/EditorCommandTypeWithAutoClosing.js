// import * as EditorCompletion from '../EditorCompletion/EditorCompletion.js'
import * as Editor from '../Editor/Editor.js'
import * as ExtensionHostBraceCompletion from '../ExtensionHost/ExtensionHostBraceCompletion.js'
import * as ExtensionHostClosingTag from '../ExtensionHost/ExtensionHostClosingTagCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

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
  const offset = TextDocument.offsetAt(editor, editor.cursor)
  const result = await ExtensionHostBraceCompletion.executeBraceCompletionProvider(editor, offset, text)
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
  const offset = TextDocument.offsetAt(editor, editor.cursor)
  const result = await ExtensionHostClosingTag.executeClosingTagProvider(editor, offset, text)
  const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

const getAutoClosingRangeChanges = []

// TODO implement typing command without brace completion -> brace completion should be independent module
export const typeWithAutoClosing = async (editor, text) => {
  console.log({ text })
  if (text === '{') {
    const changes = editorReplaceSelections(editor, ['{}'], EditOrigin.EditorTypeWithAutoClosing)
    console.log({ changes })
    return {
      ...Editor.scheduleDocumentAndCursorsSelections(editor, changes),
      autoClosingRanges: [changes[0].start.rowIndex, changes[0].start.columnIndex + 1, changes[0].end.rowIndex, changes[0].end.columnIndex + 1],
    }
  }
  // if (isBrace(text)) {
  //   console.log('is brace')
  //   return editorTypeWithBraceCompletion(editor, text)
  // }
  // if (isSlash(text)) {
  //   return editorTypeWithSlashCompletion(editor, text)
  // }
  const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
  const { autoClosingRanges } = editor
  if (autoClosingRanges.length > 0) {
    if (
      // changes[0].start.rowIndex === autoClosingRanges[0] &&
      // changes[0].start.columnIndex === autoClosingRanges[1] &&
      changes[0].end.rowIndex === autoClosingRanges[2] &&
      changes[0].end.columnIndex === autoClosingRanges[3]
    ) {
      autoClosingRanges[3] += text.length
      console.log('is edit for change')
      console.log(changes[0])
    } else {
      console.log('is not edit for change')
      console.log({ changes, autoClosingRanges })
      editor.autoClosingRanges = []
    }
  }
  // // TODO trigger characters should be monomorph -> then skip this check
  // if (
  //   editor.completionTriggerCharacters &&
  //   editor.completionTriggerCharacters.includes(text)
  // ) {
  //   Command.execute(/* EditorCompletion.openFromType */ 988)
  // }

  // TODO should editor type command know about editor completion? -> no
  // EditorCommandCompletion.openFromType(editor, text)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
