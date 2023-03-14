// import * as EditorCompletion from '../EditorCompletion/EditorCompletion.js'
import * as AutoClosing from '../AutoClosing/AutoClosing.js'
import * as Bracket from '../Bracket/Bracket.js'
import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as ExtensionHostBraceCompletion from '../ExtensionHost/ExtensionHostBraceCompletion.js'
import * as ExtensionHostClosingTag from '../ExtensionHost/ExtensionHostClosingTagCompletion.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Quote from '../Quote/Quote.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as RunEditorWidgetFunctions from './RunEditorWidgetFunctions.js'

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

const isAutoClosingBracketsEnabled = () => {
  return Boolean(Preferences.get('editor.autoClosingBrackets'))
}

const isAutoClosingQuotesEnabled = () => {
  return Boolean(Preferences.get('editor.autoClosingQuotes'))
}

const typeWithAutoClosingBracket = (editor, text) => {
  const closingBracket = getMatchingClosingBrace(text)
  const newText = text + closingBracket
  const changes = editorReplaceSelections(editor, [newText], EditOrigin.EditorTypeWithAutoClosing)
  const selectionChanges = new Uint32Array([
    changes[0].start.rowIndex,
    changes[0].start.columnIndex + 1,
    changes[0].end.rowIndex,
    changes[0].end.columnIndex + 1,
  ])
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}

const typeWithAutoClosingQuote = (editor, text) => {
  const newText = text + text
  const changes = editorReplaceSelections(editor, [newText], EditOrigin.EditorTypeWithAutoClosing)
  const selectionChanges = new Uint32Array([
    changes[0].start.rowIndex,
    changes[0].start.columnIndex + 1,
    changes[0].end.rowIndex,
    changes[0].end.columnIndex + 1,
  ])
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}

const typeWithAutoClosingDisabled = (editor, text) => {
  const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

const isAutoClosingTagsEnabled = () => {
  return true
}

const typeWithAutoClosingTag = async (editor, text) => {
  const offset = TextDocument.offsetAt(editor, editor.selections[0], editor.selections[1])
  const result = await ExtensionHostClosingTag.executeClosingTagProvider(editor, offset, text)
  if (result === undefined) {
    const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  }
  const changes = editorReplaceSelections(editor, [result.inserted], EditOrigin.EditorType)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

// TODO implement typing command without brace completion -> brace completion should be independent module
export const typeWithAutoClosing = async (editor, text) => {
  switch (text) {
    case Bracket.CurlyOpen:
    case Bracket.RoundOpen:
    case Bracket.SquareOpen:
      if (isAutoClosingBracketsEnabled()) {
        return typeWithAutoClosingBracket(editor, text)
      }
      break
    case Quote.DoubleQuote:
    case Quote.SingleQuote:
    case Quote.BackTick:
      if (isAutoClosingQuotesEnabled()) {
        return typeWithAutoClosingQuote(editor, text)
      }
      break
    // case AutoClosing.ClosingAngleBracket: // TODO support auto closing when typing closing angle bracket of start tag
    case AutoClosing.Slash:
      if (isAutoClosingTagsEnabled()) {
        return typeWithAutoClosingTag(editor, text)
      }
      break
    default:
      break
  }

  const newEditor = typeWithAutoClosingDisabled(editor, text)
  RunEditorWidgetFunctions.runEditorWidgetFunctions(newEditor, 'handleEditorType', text)
  return newEditor
  // if (isBrace(text)) {
  //   console.log('is brace')
  //   return editorTypeWithBraceCompletion(editor, text)
  // }
  // if (isSlash(text)) {
  //   return editorTypeWithSlashCompletion(editor, text)
  // }
  // // TODO trigger characters should be monomorph -> then skip this check
  // if (
  //   editor.completionTriggerCharacters &&
  //   editor.completionTriggerCharacters.includes(text)
  // ) {
  //   Command.execute(/* EditorCompletion.openFromType */ 988)
  // }

  // TODO should editor type command know about editor completion? -> no
  // EditorCommandCompletion.openFromType(editor, text)
}
