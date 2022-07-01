import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const show = async (editor, message, position) => {
  const x = EditorPosition.x(editor, position)
  const y = EditorPosition.y(editor, position)
  await RendererProcess.invoke(
    /* EditorError.show */ 'EditorError.show',
    /* message */ message,
    /* x */ x,
    /* y */ y
  )
}
