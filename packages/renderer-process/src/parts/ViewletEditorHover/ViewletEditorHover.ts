import * as SetBounds from '../SetBounds/SetBounds.ts'

export const setBounds = (state, x, y) => {
  const { $Viewlet } = state
  SetBounds.setXAndYTransform($Viewlet, x, -y)
}
