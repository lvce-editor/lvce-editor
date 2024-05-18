// @ts-ignore
import * as AutoClosing from '../AutoClosing/AutoClosing.js'
// @ts-ignore
import * as Bracket from '../Bracket/Bracket.js'
// @ts-ignore
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
// @ts-ignore
import * as Editor from '../Editor/Editor.js'
// @ts-ignore
import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.js'
// @ts-ignore
import * as EditorFunctionType from '../EditorFunctionType/EditorFunctionType.js'
// @ts-ignore
import * as Preferences from '../Preferences/Preferences.js'
// @ts-ignore
import * as Quote from '../Quote/Quote.js'
// @ts-ignore
import * as ShouldAutoTriggerSuggest from '../ShouldAutoTriggerSuggest/ShouldAutoTriggerSuggest.js'
import * as CommandOpenCompletion from './EditorCommandCompletion.js'
import * as EditorCommandGetWordAt from './EditorCommandGetWordAt.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'
import * as EditorType from './EditorCommandType.js'
import * as EditorTypeWithAutoClosingBracket from './EditorCommandTypeWithAutoClosingBracket.js'
import * as EditorTypeWithAutoClosingEndBracket from './EditorCommandTypeWithAutoClosingEndBracket.js'
import * as EditorTypeWithAutoClosingQuote from './EditorCommandTypeWithAutoClosingQuote.js'
import * as EditorTypeWithAutoClosingTag from './EditorCommandTypeWithAutoClosingTag.js'

export const state = {
  listeners: [],
}

const isAutoClosingBracketsEnabled = () => {
  return Boolean(Preferences.get('editor.autoClosingBrackets'))
}

const isAutoClosingQuotesEnabled = () => {
  return Boolean(Preferences.get('editor.autoClosingQuotes'))
}

const isQuickSuggestionsEnabled = () => {
  return Boolean(Preferences.get('editor.quickSuggestions'))
}

// @ts-ignore
const typeWithAutoClosingDisabled = (editor, text) => {
  const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

const isAutoClosingTagsEnabled = () => {
  return true
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
  switch (text) {
    case Bracket.CurlyOpen:
    case Bracket.RoundOpen:
    case Bracket.SquareOpen:
      if (isAutoClosingBracketsEnabled()) {
        return {
          newState: EditorTypeWithAutoClosingBracket.typeWithAutoClosingBracket(editor, text),
          commands: [],
        }
      }
      break
    case Bracket.CurlyClose:
    case Bracket.RoundClose:
    case Bracket.SquareClose:
      if (isAutoClosingBracketsEnabled()) {
        return {
          newState: EditorTypeWithAutoClosingEndBracket.typeWithAutoClosingEndBracket(editor, text),
          commands: [],
        }
      }
      break
    case Quote.DoubleQuote:
    case Quote.SingleQuote:
    case Quote.BackTick:
      if (isAutoClosingQuotesEnabled()) {
        return {
          newState: EditorTypeWithAutoClosingQuote.typeWithAutoClosingQuote(editor, text),
          commands: [],
        }
      }
      break
    // case AutoClosing.ClosingAngleBracket: // TODO support auto closing when typing closing angle bracket of start tag
    case AutoClosing.Slash:
      if (isAutoClosingTagsEnabled()) {
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
  const extraCommands = []
  if (isQuickSuggestionsEnabled() && newEditor.completionState === EditorCompletionState.None) {
    openCompletion(newEditor, text)
  }

  return {
    newState: newEditor,
    commands: extraCommands,
  }
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
