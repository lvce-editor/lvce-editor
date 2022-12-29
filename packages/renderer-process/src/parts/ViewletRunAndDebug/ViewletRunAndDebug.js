import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletDebugEvents from './ViewletRunAndDebugEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet RunAndDebug'
  $Viewlet.tabIndex = 0
  $Viewlet.onmousedown = ViewletDebugEvents.handleMouseDown

  return {
    $Viewlet,
  }
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  const $Root = VirtualDom.render(dom)
  $Viewlet.replaceChildren($Root)
}
