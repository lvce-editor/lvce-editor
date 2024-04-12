import * as SetBounds from '../SetBounds/SetBounds.ts'
export * as Events from './ViewletEditorSourceActionsEvents.ts'

export const setBounds = (state, x, y) => {
  const { $Viewlet } = state
  SetBounds.setXAndYTransform($Viewlet, x, -y)
}
