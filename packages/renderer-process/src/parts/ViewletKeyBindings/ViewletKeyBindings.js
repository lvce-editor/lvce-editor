import * as InputBox from '../InputBox/InputBox.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletkeyBindingsEvents from './ViewletKeyBindingsEvents.js'
import * as DomEventType from '../DomEventType/DomEventType.js'

/**
 * @enum {string}
 */
const UiStrings = {
  SearchKeyBindings: 'Search Key Bindings', // TODO placeholder string should come from renderer worker
  ResultsWillUpdateAsYouType: 'Results will update as you type',
}

export const create = () => {
  const $InputBox = InputBox.create()
  $InputBox.type = 'search'
  $InputBox.placeholder = UiStrings.SearchKeyBindings
  // @ts-ignore
  $InputBox.ariaDescription = UiStrings.ResultsWillUpdateAsYouType
  $InputBox.oninput = ViewletkeyBindingsEvents.handleInput

  const $KeyBindingsHeader = document.createElement('div')
  $KeyBindingsHeader.className = 'KeyBindingsHeader'
  $KeyBindingsHeader.append($InputBox)

  const $KeyBindingsTableWrapper = document.createElement('div')
  $KeyBindingsTableWrapper.className = 'KeyBindingsTableWrapper'
  $KeyBindingsTableWrapper.addEventListener(
    DomEventType.Wheel,
    ViewletkeyBindingsEvents.handleWheel,
    { passive: true }
  )
  $KeyBindingsTableWrapper.onclick = ViewletkeyBindingsEvents.handleTableClick

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBar'
  $ScrollBar.onpointerdown = ViewletkeyBindingsEvents.handleScrollBarPointerDown
  $ScrollBar.append($ScrollBarThumb)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet KeyBindings'
  $Viewlet.append($KeyBindingsHeader, $KeyBindingsTableWrapper, $ScrollBar)

  const $Resizer1 = document.createElement('div')
  $Resizer1.className = 'Resizer'
  $Resizer1.onpointerdown = ViewletkeyBindingsEvents.handleResizerPointerDown

  const $Resizer2 = document.createElement('div')
  $Resizer2.className = 'Resizer'
  $Resizer2.onpointerdown = ViewletkeyBindingsEvents.handleResizerPointerDown

  $KeyBindingsTableWrapper.append($Resizer1, $Resizer2)

  return {
    $Viewlet,
    $InputBox,
    $KeyBindingsHeader,
    $KeyBindingsTableWrapper,
    $ScrollBarThumb,
    $ScrollBar,
    $Resizer1,
    $Resizer2,
  }
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

export const setColumnWidths = (
  state,
  columnWidth1,
  columnWidth2,
  columnWidth3
) => {
  const paddingLeft = 15
  const { $Resizer1, $Resizer2 } = state
  $Resizer1.style.left = `${paddingLeft + columnWidth1}px`
  $Resizer2.style.left = `${paddingLeft + columnWidth1 + columnWidth2}px`
}

export * from '../ViewletScrollable/ViewletScrollable.js'
export * from '../ViewletSizable/ViewletSizable.js'
