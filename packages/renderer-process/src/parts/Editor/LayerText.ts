import * as Assert from '../Assert/Assert.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'

export const setLineInfos = (state, dom) => {
  Assert.object(state)
  Assert.array(dom)
  const { $LayerText } = state
  VirtualDom.renderInto($LayerText, dom)
}
