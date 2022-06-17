import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const show = (editor, message, position) => {
  const x = EditorPosition.x(editor, position)
  const y = EditorPosition.y(editor, position)
  RendererProcess.send([
    /* EditorError.show */ 3700,
    /* message */ message,
    /* x */ x,
    /* y */ y,
  ])
}
