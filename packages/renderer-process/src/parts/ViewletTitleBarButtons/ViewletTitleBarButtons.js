import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletTitleBarButtonEvents from './ViewletTitleBarButtonsEvents.js'

export const create = () => {
  const $TitleBarButtons = document.createElement('div')
  $TitleBarButtons.className = 'TitleBarButtons'
  return {
    $TitleBarButtons,
    $Viewlet: $TitleBarButtons,
  }
}

export const attachEvents = (state) => {
  const { $TitleBarButtons } = state
  $TitleBarButtons.onmousedown = ViewletTitleBarButtonEvents.handleTitleBarButtonsClick
}

export const setDom = (state, dom) => {
  const { $TitleBarButtons } = state
  VirtualDom.renderInto($TitleBarButtons, dom)
}
