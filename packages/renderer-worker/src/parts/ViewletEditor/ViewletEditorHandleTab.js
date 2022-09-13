import * as EditorTabCompletion from './ViewletEditorTabCompletion.js/index.js'
import * as EditorType from './ViewletEditorType.js/index.js'
import * as EditorIndent from './ViewletEditorIndentMore.js/index.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'

// TODO tab doesn't work well with configurable keybindings
export const editorHandleTab = async (editor) => {
  if (EditorSelection.isEverySelectionEmpty(editor.selections)) {
    console.log('call tab completion')
    const applied = await EditorTabCompletion.editorTabCompletion(editor)
    if (applied !== editor) {
      return applied
    }
    // TODO have setting what should be inserted on tab
    return EditorType.editorType(editor, '  ')
  }
  return EditorIndent.editorIndentMore(editor)
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
