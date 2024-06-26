import * as AutoClosing from '../AutoClosing/AutoClosing.ts'
import * as Bracket from '../Bracket/Bracket.ts'
import * as Quote from '../Quote/Quote.ts'
import * as EditorType from './EditorCommandType.ts'
import * as EditorTypeWithAutoClosingBracket from './EditorCommandTypeWithAutoClosingBracket.ts'
import * as EditorTypeWithAutoClosingEndBracket from './EditorCommandTypeWithAutoClosingEndBracket.ts'
import * as EditorTypeWithAutoClosingQuote from './EditorCommandTypeWithAutoClosingQuote.ts'
import * as EditorTypeWithAutoClosingTag from './EditorCommandTypeWithAutoClosingTag.ts'

export const state = {
  listeners: [],
}

// const openCompletion = async (editor: any, text: string) => {
//   const { selections } = editor
//   const rowIndex = selections[0]
//   const columnIndex = selections[1]
//   const word = EditorCommandGetWordAt.getWordAt(editor, rowIndex, columnIndex)
//   if (!ShouldAutoTriggerSuggest.shouldAutoTriggerSuggest(word)) {
//     return
//   }
//   editor.completionState = EditorCompletionState.Loading
//   editor.widgets = editor.widgets || []
//   editor.widgets.push('EditorCompletion')
//   await CommandOpenCompletion.openCompletion(editor)
//   editor.completionState = EditorCompletionState.Visible
// }

// TODO implement typing command without brace completion -> brace completion should be independent module
export const typeWithAutoClosing = async (editor: any, text: string) => {
  switch (text) {
    case Bracket.CurlyOpen:
    case Bracket.RoundOpen:
    case Bracket.SquareOpen:
      if (editor.autoClosingBracketsEnabled) {
        return EditorTypeWithAutoClosingBracket.typeWithAutoClosingBracket(editor, text)
      }
      break
    case Bracket.CurlyClose:
    case Bracket.RoundClose:
    case Bracket.SquareClose:
      if (editor.autoClosingBracketsEnabled) {
        return EditorTypeWithAutoClosingEndBracket.typeWithAutoClosingEndBracket(editor, text)
      }
      break
    case Quote.DoubleQuote:
    case Quote.SingleQuote:
    case Quote.BackTick:
      if (editor.autoClosingQuotesEnabled) {
        return EditorTypeWithAutoClosingQuote.typeWithAutoClosingQuote(editor, text)
      }
      break
    // case AutoClosing.ClosingAngleBracket: // TODO support auto closing when typing closing angle bracket of start tag
    case AutoClosing.Slash:
      if (editor.autoClosingTagsEnabled) {
        return await EditorTypeWithAutoClosingTag.typeWithAutoClosingTag(editor, text)
      }
      break
    default:
      break
  }

  const newEditor = EditorType.type(editor, text)
  // const extraCommands: any[] = []
  // if (editor.quickSuggestionsEnabled && newEditor.completionState === EditorCompletionState.None) {
  //   openCompletion(newEditor, text)
  // }

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
