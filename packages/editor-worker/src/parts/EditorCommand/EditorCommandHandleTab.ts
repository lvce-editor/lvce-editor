// @ts-ignore
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as EditorIndent from './EditorCommandIndentMore.ts'
import * as EditorTabCompletion from './EditorCommandTabCompletion.ts'
import * as EditorType from './EditorCommandType.ts'

// TODO tab doesn't work well with configurable keybindings
// @ts-ignore
export const handleTab = async (editor) => {
  if (EditorSelection.isEverySelectionEmpty(editor.selections)) {
    const applied = await EditorTabCompletion.tabCompletion(editor)
    if (applied !== editor) {
      return applied
    }
    // TODO have setting what should be inserted on tab
    return EditorType.type(editor, '  ')
  }
  return EditorIndent.indentMore(editor)
}

// const editor = {
//   textDocument: {
//     lines: ['line 1', 'line 2', 'line 3', 'line 4'],
//   },
//   cursor: {
//     rowIndex: 0,
//     columnIndex: 1,
//   },
//   selections: [
//     {
//       start: {
//         rowIndex: 1,
//         columnIndex: 1,
//       },
//       end: {
//         rowIndex: 2,
//         columnIndex: 2,
//       },
//     },
//   ],
// }
// const main = async () => {
//   await editorHandleTab(editor)
//   editor.lines //?
// }

// main()
