import * as VirtualDom from '../VirtualDom/VirtualDom.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet DebugConsole'
  return {
    $Viewlet,
  }
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}

export const focus = (state) => {
  // const { $Input } = state
  // $Input.focus()
}

export const setText = (state, text) => {
  // const { $DebugConsoleTop } = state
  // $DebugConsoleTop.textContent = text
}
