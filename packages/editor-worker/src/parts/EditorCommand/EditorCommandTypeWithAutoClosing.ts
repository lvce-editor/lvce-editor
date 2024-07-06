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

// TODO implement typing command without brace completion -> brace completion should be independent module
export const typeWithAutoClosing = async (editor: any, text: string) => {
  const { isAutoClosingBracketsEnabled, isAutoClosingQuotesEnabled, isAutoClosingTagsEnabled } = editor
  switch (text) {
    case Bracket.CurlyOpen:
    case Bracket.RoundOpen:
    case Bracket.SquareOpen:
      if (isAutoClosingBracketsEnabled) {
        return EditorTypeWithAutoClosingBracket.typeWithAutoClosingBracket(editor, text)
      }
      break
    case Bracket.CurlyClose:
    case Bracket.RoundClose:
    case Bracket.SquareClose:
      if (isAutoClosingBracketsEnabled) {
        return EditorTypeWithAutoClosingEndBracket.typeWithAutoClosingEndBracket(editor, text)
      }
      break
    case Quote.DoubleQuote:
    case Quote.SingleQuote:
    case Quote.BackTick:
      console.log({ auto: editor })
      if (isAutoClosingQuotesEnabled) {
        return EditorTypeWithAutoClosingQuote.typeWithAutoClosingQuote(editor, text)
      }
      break
    // case AutoClosing.ClosingAngleBracket: // TODO support auto closing when typing closing angle bracket of start tag
    case AutoClosing.Slash:
      if (isAutoClosingTagsEnabled) {
        return EditorTypeWithAutoClosingTag.typeWithAutoClosingTag(editor, text)
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
