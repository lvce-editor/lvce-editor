import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const show = async (editor, message, position) => {
  const x = EditorPosition.x(editor, position.rowIndex, position.columnIndex)
  const y = EditorPosition.y(editor, position.rowIndex, position.columnIndex)
  await RendererProcess.invoke(
    /* EditorError.show */ 'EditorError.show',
    /* message */ message,
    /* x */ x,
    /* y */ y
  )
}
