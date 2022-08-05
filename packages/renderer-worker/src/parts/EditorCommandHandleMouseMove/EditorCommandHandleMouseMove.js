import * as ExtensionHostHover from '../ExtensionHost/ExtensionHostHover.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorPosition from '../EditorCommandPosition/EditorCommandPosition.js'

const getHover = async (editor, rowIndex, columnIndex) => {
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const hover = await ExtensionHostHover.executeHoverProvider(editor, offset)
  return hover
}

const showHover = async (editor, position) => {
  const hover = await getHover(editor, position.rowIndex, position.columnIndex)
  if (!hover) {
    console.log('no hover')
    return
  }

  RendererProcess.invoke(
    /* EditorHover.show */ 6216,
    /* x */ editor.left + position.columnIndex * editor.columnWidth,
    /* y */ editor.top + position.rowIndex * editor.rowHeight,
    /* hover */ hover
  )
  console.log({ hover })
}

export const editorHandleMouseMove = (editor, x, y) => {
  const position = EditorPosition.at(editor, x, y)
  // console.log(position)
  // showHover(editor, position)
  return editor
}
