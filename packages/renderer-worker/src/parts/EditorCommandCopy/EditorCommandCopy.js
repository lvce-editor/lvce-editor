import * as Command from '../Command/Command.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Editor from '../Editor/Editor.js'

// TODO add test
export const editorCopy = async (editor) => {
  if (!Editor.hasSelection(editor)) {
    // TODO copy line where cursor is
    return editor
  }
  const selection = editor.selections[0]
  const text = TextDocument.getSelectionText(editor, selection).join('\n')
  console.log({ text })
  try {
    await Command.execute(
      /* ClipBoard.writeText */ 'ClipBoard.writeText',
      /* text */ text
    )
  } catch (error) {
    console.warn(error)
  }
  return editor
}
