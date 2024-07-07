export const name = 'EditorHover'

import * as ViewletEditorHover from './ViewletEditorHover.js'

export * from './ViewletEditorHover.js'
export * from './ViewletEditorHoverCss.js'
export * from './ViewletEditorHoverRender.js'

export const Commands = {
  handleSashPointerDown: ViewletEditorHover.handleSashPointerDown,
  handleSashPointerMove: ViewletEditorHover.handleSashPointerMove,
  handleSashPointerUp: ViewletEditorHover.handleSashPointerUp,
}
