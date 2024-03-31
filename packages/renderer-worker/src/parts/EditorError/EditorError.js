import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const show = async (editor, message, rowIndex, columnIndex) => {
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  // @ts-ignore
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  await RendererProcess.invoke(/* EditorError.show */ 'EditorError.show', /* message */ message, /* x */ x, /* y */ y)
}
