import * as VirtualDom from '../VirtualDom/VirtualDom.ts'

export const setDecorationsDom = (state, decorations) => {
  const { $LayerDiagnostics } = state
  VirtualDom.renderInto($LayerDiagnostics, decorations)
}
