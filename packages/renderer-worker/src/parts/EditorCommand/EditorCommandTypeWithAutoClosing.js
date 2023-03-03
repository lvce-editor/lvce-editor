// import * as EditorCompletion from '../EditorCompletion/EditorCompletion.js'
import * as Bracket from '../Bracket/Bracket.js'
import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as ExtensionHostBraceCompletion from '../ExtensionHost/ExtensionHostBraceCompletion.js'
import * as ExtensionHostClosingTag from '../ExtensionHost/ExtensionHostClosingTagCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

const RE_CHARACTER = new RegExp(/^\p{L}/, 'u')

export const state = {
  listeners: [],
}

const getMatchingClosingBrace = (brace) => {
  switch (brace) {
    case Bracket.CurlyOpen:
      return Bracket.CurlyClose
    case Bracket.RoundOpen:
      return Bracket.RoundClose
    case Bracket.SquareOpen:
      return Bracket.SquareClose
    default:
      return '???'
  }
}

const isBrace = (text) => {
  if (text.length !== 1) {
    return false
  }
  switch (text) {
    case Bracket.CurlyOpen:
    case Bracket.RoundOpen:
    case Bracket.SquareClose:
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
    const changes = editorReplaceSelections(editor, [insertText], EditOrigin.EditorType)
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  }
  const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
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
  if (text === Bracket.CurlyOpen) {
    const changes = editorReplaceSelections(editor, ['{}'], EditOrigin.EditorTypeWithAutoClosing)
    const selectionChanges = new Uint32Array([
      changes[0].start.rowIndex,
      changes[0].start.columnIndex + 1,
      changes[0].end.rowIndex,
      changes[0].end.columnIndex + 1,
    ])
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
  }
  // if (isBrace(text)) {
  //   console.log('is brace')
  //   return editorTypeWithBraceCompletion(editor, text)
  // }
  // if (isSlash(text)) {
  //   return editorTypeWithSlashCompletion(editor, text)
  // }
  const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)

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
