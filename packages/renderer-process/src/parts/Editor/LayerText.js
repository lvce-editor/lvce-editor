import * as Assert from '../Assert/Assert.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'

export const setLineInfos = (state, dom) => {
  Assert.object(state)
  Assert.array(dom)
  const { $LayerText } = state
  VirtualDom.renderInto($LayerText, dom)
}
