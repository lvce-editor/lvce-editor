import * as AutoClosing from '../AutoClosing/AutoClosing.js'
import * as Bracket from '../Bracket/Bracket.js'
import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.js'
import * as EditorFunctionType from '../EditorFunctionType/EditorFunctionType.js'
import * as Quote from '../Quote/Quote.js'
import * as ShouldAutoTriggerSuggest from '../ShouldAutoTriggerSuggest/ShouldAutoTriggerSuggest.js'
import * as CommandOpenCompletion from './EditorCommandCompletion.js'
import * as EditorCommandGetWordAt from './EditorCommandGetWordAt.js'
import * as EditorType from './EditorCommandType.js'
import * as EditorTypeWithAutoClosingBracket from './EditorCommandTypeWithAutoClosingBracket.js'
import * as EditorTypeWithAutoClosingEndBracket from './EditorCommandTypeWithAutoClosingEndBracket.js'
import * as EditorTypeWithAutoClosingQuote from './EditorCommandTypeWithAutoClosingQuote.js'
import * as EditorTypeWithAutoClosingTag from './EditorCommandTypeWithAutoClosingTag.js'
import * as RunEditorWidgetFunctions from './RunEditorWidgetFunctions.js'

export const state = {
  listeners: [],
}

const openCompletion = async (editor, text) => {
  const { selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const word = EditorCommandGetWordAt.getWordAt(editor, rowIndex, columnIndex)
  if (!ShouldAutoTriggerSuggest.shouldAutoTriggerSuggest(word)) {
    return
  }
  editor.completionState = EditorCompletionState.Loading
  editor.widgets = editor.widgets || []
  editor.widgets.push('EditorCompletion')
  await CommandOpenCompletion.openCompletion(editor)
  editor.completionState = EditorCompletionState.Visible
}

// TODO implement typing command without brace completion -> brace completion should be independent module
export const typeWithAutoClosing = async (editor, text) => {
  const {
    isAutoClosingBracketsEnabled,
    isAutoClosingQuotesEnabled,
    isAutoClosingTagsEnabled,
    isQuickSuggestionsEnabled,
    completionTriggerCharacters,
  } = editor
  switch (text) {
    case Bracket.CurlyOpen:
    case Bracket.RoundOpen:
    case Bracket.SquareOpen:
      if (isAutoClosingBracketsEnabled) {
        return {
          newState: EditorTypeWithAutoClosingBracket.typeWithAutoClosingBracket(editor, text),
          commands: [],
        }
      }
      break
    case Bracket.CurlyClose:
    case Bracket.RoundClose:
    case Bracket.SquareClose:
      if (isAutoClosingBracketsEnabled) {
        return {
          newState: EditorTypeWithAutoClosingEndBracket.typeWithAutoClosingEndBracket(editor, text),
          commands: [],
        }
      }
      break
    case Quote.DoubleQuote:
    case Quote.SingleQuote:
    case Quote.BackTick:
      if (isAutoClosingQuotesEnabled) {
        return {
          newState: EditorTypeWithAutoClosingQuote.typeWithAutoClosingQuote(editor, text),
          commands: [],
        }
      }
      break
    // case AutoClosing.ClosingAngleBracket: // TODO support auto closing when typing closing angle bracket of start tag
    case AutoClosing.Slash:
      const { lines, selections } = editor
      const [rowIndex, columnIndex] = selections
      const line = lines[rowIndex]
      const characterBefore = line[columnIndex - 1]
      if (isAutoClosingTagsEnabled && characterBefore === '<') {
        return {
          newState: await EditorTypeWithAutoClosingTag.typeWithAutoClosingTag(editor, text),
          commands: [],
        }
      }
      break
    default:
      break
  }

  const newEditor = EditorType.type(editor, text)
  const extraCommands = RunEditorWidgetFunctions.runEditorWidgetFunctions(newEditor, EditorFunctionType.HandleEditorType, text)
  if (isQuickSuggestionsEnabled && completionTriggerCharacters.includes(text)) {
    openCompletion(newEditor, text)
  }

  return {
    newState: newEditor,
    commands: extraCommands,
  }
}
