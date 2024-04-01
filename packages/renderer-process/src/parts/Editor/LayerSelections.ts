import * as VirtualDom from '../VirtualDom/VirtualDom.ts'

export const setSelections = (state, dom) => {
  const { $LayerSelections } = state
  VirtualDom.renderInto($LayerSelections, dom)
}
