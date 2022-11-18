// import * as EditorCompletion from '../EditorCompletion/EditorCompletion.js'
import * as Editor from '../Editor/Editor.js'
import * as ExtensionHostBraceCompletion from '../ExtensionHost/ExtensionHostBraceCompletion.js'
import * as ExtensionHostClosingTag from '../ExtensionHost/ExtensionHostClosingTagCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'
import * as Quotes from '../Quotes/Quotes.js'

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
  const result =
    await ExtensionHostBraceCompletion.executeBraceCompletionProvider(
      editor,
      offset,
      text
    )
  console.log({ result })
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
  const result = await ExtensionHostClosingTag.executeClosingTagProvider(
    editor,
    offset,
    text
  )
  const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

const typeDefault = (editor, text) => {
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

const typeSingleQuote = (editor, text) => {}

const typeDoubleQuote = (editor, text) => {
  const { lines, selections } = editor
  const rowIndex = selections[0]
  const line = lines[rowIndex]
  if (line.includes(Quotes.DoubleQuote)) {
    return typeDefault(editor, text)
  }
  const changes = []
  const inserted = [Quotes.DoubleQuote + Quotes.DoubleQuote]
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    const start = {
      rowIndex: selectionStartRow,
      columnIndex: selectionStartColumn,
    }
    const end = {
      rowIndex: selectionEndRow,
      columnIndex: selectionEndColumn,
    }
    const selection = {
      start,
      end,
    }
    changes.push({
      start: start,
      end: end,
      inserted,
      deleted: TextDocument.getSelectionText(editor, selection),
      origin: EditOrigin.EditorType,
    })
  }
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

// TODO implement typing command without brace completion -> brace completion should be independent module
export const type = async (editor, text) => {
  if (text === Quotes.DoubleQuote) {
    return typeDoubleQuote(editor, text)
  }
  return typeDefault(editor, text)
}

export const onDidType = (listener) => {
  state.listeners.push(listener)
  // TODO unregister
}
