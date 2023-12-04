import * as VirtualDom from '../VirtualDom/VirtualDom.js'

export const setSelections = (state, dom) => {
  const { $LayerSelections } = state
  VirtualDom.renderInto($LayerSelections, dom)
}
