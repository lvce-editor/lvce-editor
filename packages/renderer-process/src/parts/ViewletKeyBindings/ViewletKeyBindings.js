import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletkeyBindingsEvents from './ViewletKeyBindingsEvents.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'

export const name = 'KeyBindings'

export const create = () => {
  const $InputBox = InputBox.create()
  $InputBox.type = 'search'
  $InputBox.placeholder = 'Search Key Bindings' // TODO placeholder string should come from renderer worker
  // @ts-ignore
  $InputBox.ariaDescription = 'Results will update as you type'
  $InputBox.oninput = ViewletkeyBindingsEvents.handleInput

  const $KeyBindingsHeader = document.createElement('div')
  $KeyBindingsHeader.className = 'KeyBindingsHeader'
  $KeyBindingsHeader.append($InputBox)

  const $KeyBindingsTableWrapper = document.createElement('div')
  $KeyBindingsTableWrapper.className = 'KeyBindingsTableWrapper'
  $KeyBindingsTableWrapper.addEventListener(
    'wheel',
    ViewletkeyBindingsEvents.handleWheel,
    { passive: true }
  )
  $KeyBindingsTableWrapper.onclick = ViewletkeyBindingsEvents.handleTableClick

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet KeyBindings'
  $Viewlet.append($KeyBindingsHeader, $KeyBindingsTableWrapper)

  return {
    $Viewlet,
    $InputBox,
    $KeyBindingsHeader,
    $KeyBindingsTableWrapper,
  }
}

export const setTableDom = (state, dom) => {
  const { $KeyBindingsTableWrapper } = state
  const $Root = VirtualDom.render(dom)
  $KeyBindingsTableWrapper.replaceChildren($Root.firstChild)
}

export const setValue = (state, value) => {
  const { $InputBox } = state
  $InputBox.value = value
}
