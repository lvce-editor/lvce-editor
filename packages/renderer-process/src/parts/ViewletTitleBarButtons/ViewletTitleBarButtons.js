import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletTitleBarButtonEvents from './ViewletTitleBarButtonsEvents.js'

export const create = () => {
  const $TitleBarButtons = document.createElement('div')
  $TitleBarButtons.className = 'Viewlet TitleBarButtons'
  return {
    $TitleBarButtons,
    $Viewlet: $TitleBarButtons,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  $Viewlet.onmousedown = ViewletTitleBarButtonEvents.handleTitleBarButtonsClick
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}
