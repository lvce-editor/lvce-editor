import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletSimpleBrowserEvents from './ViewletSimpleBrowserEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet SimpleBrowser'
  return {
    $Viewlet,
  }
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom, ViewletSimpleBrowserEvents)
}

export const dispose = (state) => {}
