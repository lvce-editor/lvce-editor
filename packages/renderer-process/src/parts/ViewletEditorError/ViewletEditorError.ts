import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'

// TODO not sure whether created dom node
// should stay in state or be removed
// one option would result in less memory usage
// the other option would result in less garbage collection

// probably should optimize for less memory usage by default
// unless the element is very likely to be used again soon (<30s)
// but that's difficult to know

// TODO hide widget after timeout or mousemove

// TODO aria alert

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet EditorError'

  return {
    $Viewlet,
  }
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}

export const setBounds = (state, x, y, width, height) => {
  const { $Viewlet } = state
  SetBounds.setBounds($Viewlet, x, y, width, height)
}
