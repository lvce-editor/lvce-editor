import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletStorageEvents from './ViewletStorageEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Storage'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  $Viewlet.onclick = ViewletStorageEvents.handleClick
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}
