export const name = 'EditorHover'

import * as ViewletEditorHover from './ViewletEditorHover.ts'

export * from './ViewletEditorHover.ts'
export * from './ViewletEditorHoverCss.ts'
export * from './ViewletEditorHoverRender.ts'

export const Commands = {
  handleSashPointerDown: ViewletEditorHover.handleSashPointerDown,
  handleSashPointerMove: ViewletEditorHover.handleSashPointerMove,
  handleSashPointerUp: ViewletEditorHover.handleSashPointerUp,
}
