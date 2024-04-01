import * as VirtualDom from '../VirtualDom/VirtualDom.js'

export const setDecorationsDom = (state, decorations) => {
  const { $LayerDiagnostics } = state
  VirtualDom.renderInto($LayerDiagnostics, decorations)
}
