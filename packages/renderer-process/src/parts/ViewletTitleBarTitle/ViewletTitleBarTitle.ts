import * as VirtualDom from '../VirtualDom/VirtualDom.ts'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet TitleBarTitle'
  return {
    $Viewlet,
  }
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}
