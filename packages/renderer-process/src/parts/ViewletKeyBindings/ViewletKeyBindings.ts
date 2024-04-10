import * as DomEventOptions from '../DomEventOptions/DomEventOptions.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as InputBox from '../InputBox/InputBox.ts'
import * as InputType from '../InputType/InputType.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as ViewletkeyBindingsEvents from './ViewletKeyBindingsEvents.ts'

export const attachEvents = (state) => {
  const { $Viewlet } = state
  $Viewlet.onpointerdown = ViewletkeyBindingsEvents.handlePointerDown
  $Viewlet.ondblclick = ViewletkeyBindingsEvents.handleTableDoubleClick
  $Viewlet.addEventListener(DomEventType.Input, ViewletkeyBindingsEvents.handleInput, { capture: true })
  $Viewlet.addEventListener(DomEventType.Wheel, ViewletkeyBindingsEvents.handleWheel, DomEventOptions.Passive)
}

export const setTableDom = (state, dom) => {
  const { $KeyBindingsTableWrapper } = state
  const $Root = VirtualDom.render(dom)
  const $Child = $KeyBindingsTableWrapper.children[0]
  if ($Child.tagName === 'TABLE') {
    $Child.replaceWith($Root.firstChild)
  } else {
    $KeyBindingsTableWrapper.prepend($Root.firstChild)
  }
}

export const setValue = (state, value) => {
  const { $InputBox } = state
  $InputBox.value = value
}

export const setColumnWidths = (state, columnWidth1, columnWidth2, columnWidth3) => {
  const paddingLeft = 15
  const { $Viewlet } = state
  const $$Resizers = $Viewlet.querySelectorAll('.Resizer')
  const $Resizer1 = $$Resizers[0]
  const $Resizer2 = $$Resizers[1]
  $Resizer1.style.left = `${paddingLeft + columnWidth1}px`
  $Resizer2.style.left = `${paddingLeft + columnWidth1 + columnWidth2}px`
}

export * from '../ViewletScrollable/ViewletScrollable.ts'
export * from '../ViewletSizable/ViewletSizable.ts'
