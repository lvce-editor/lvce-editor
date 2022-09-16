import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletkeyBindingsEvents from './ViewletKeyBindingsEvents.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'

export const name = 'KeyBindings'

export const create = () => {
  const $InputBox = InputBox.create()
  $InputBox.type = 'search'
  $InputBox.placeholder = 'Search Key Bindings' // TODO placeholder string should come from renderer worker
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

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'KeyBindings'
  $Viewlet.append($KeyBindingsHeader, $KeyBindingsTableWrapper)

  return {
    $Viewlet,
    $InputBox,
    $KeyBindingsHeader,
    $KeyBindingsTableWrapper,
  }
}

const replaceChildren = ($Element, $NewChildren) => {
  $Element.replaceChildren($NewChildren)
}

export const setTableDom = (state, dom) => {
  const { $KeyBindingsTableWrapper } = state
  console.log(dom)
  const $Root = VirtualDom.render(dom)
  console.log($Root)
  replaceChildren($KeyBindingsTableWrapper, $Root.firstChild)
}
