import * as Assert from '../Assert/Assert.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'

export const setCursors = (state, dom) => {
  Assert.object(state)
  Assert.array(dom)
  const { $LayerCursor } = state
  VirtualDom.renderInto($LayerCursor, dom)
}
