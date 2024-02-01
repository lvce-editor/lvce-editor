import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletDebugConsoleEvents from './ViewletDebugConsoleEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet DebugConsole'
  return {
    $Viewlet,
  }
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom, ViewletDebugConsoleEvents)
}
