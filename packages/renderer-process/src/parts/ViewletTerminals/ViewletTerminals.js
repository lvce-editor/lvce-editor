import * as VirtualDom from '../VirtualDom/VirtualDom.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Terminals'
  return {
    $Viewlet,
  }
}

export const setTabsDom = (state, dom) => {
  const { $Viewlet } = state
  const $Root = document.createElement('div')
  VirtualDom.renderInto($Root, dom)
  $Viewlet.append($Root.firstChild)
}
