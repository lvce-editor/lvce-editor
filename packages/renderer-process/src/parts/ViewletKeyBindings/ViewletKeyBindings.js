import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletkeyBindingsEvents from './ViewletKeyBindingsEvents.js'
import * as SetBounds from '../SetBounds/SetBounds.js'

/**
 * @enum {string}
 */
const UiStrings = {
  SearchKeyBindings: 'Search Key Bindings', // TODO placeholder string should come from renderer worker
  ResultsWillUpdateAsYouType: 'Results will update as you type',
}

export const create = () => {
  const $VirtualInputBoxText = document.createElement('span')
  $VirtualInputBoxText.className = 'VirtualInputBoxText'

  const $HiddenInput = document.createElement('input')
  $HiddenInput.className = 'HiddenInput'
  $HiddenInput.onblur = ViewletkeyBindingsEvents.handleInputBlur

  const $VirtualInputBoxCursor = document.createElement('div')
  $VirtualInputBoxCursor.className = 'VirtualInputBoxCursor'

  const $VirtualInputBox = document.createElement('div')
  $VirtualInputBox.className = 'VirtualInputBox'
  $VirtualInputBox.append($HiddenInput, $VirtualInputBoxText, $VirtualInputBoxCursor)
  $VirtualInputBox.onclick = ViewletkeyBindingsEvents.handleInputClick
  $VirtualInputBox.onbeforeinput = ViewletkeyBindingsEvents.handleBeforeInput

  const $KeyBindingsHeader = document.createElement('div')
  $KeyBindingsHeader.className = 'KeyBindingsHeader'
  $KeyBindingsHeader.append($VirtualInputBox)

  const $KeyBindingsTableWrapper = document.createElement('div')
  $KeyBindingsTableWrapper.className = 'KeyBindingsTableWrapper'

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBar'
  $ScrollBar.append($ScrollBarThumb)

  const $Resizer1 = document.createElement('div')
  $Resizer1.className = 'Resizer'

  const $Resizer2 = document.createElement('div')
  $Resizer2.className = 'Resizer'

  $KeyBindingsTableWrapper.append($Resizer1, $Resizer2)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet KeyBindings'
  $Viewlet.append($KeyBindingsHeader, $KeyBindingsTableWrapper, $ScrollBar)
  $Viewlet.onpointerdown = ViewletkeyBindingsEvents.handlePointerDown
  $Viewlet.addEventListener(DomEventType.Input, ViewletkeyBindingsEvents.handleInput, { capture: true })
  $Viewlet.addEventListener(DomEventType.Wheel, ViewletkeyBindingsEvents.handleWheel, DomEventOptions.Passive)

  return {
    $Viewlet,
    $HiddenInput,
    $KeyBindingsHeader,
    $KeyBindingsTableWrapper,
    $ScrollBarThumb,
    $ScrollBar,
    $Resizer1,
    $Resizer2,
    $VirtualInputBoxText,
    $VirtualInputBoxCursor,
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

export const setInputValue = (state, value) => {
  const { $VirtualInputBoxText } = state
  $VirtualInputBoxText.textContent = value
}

export const setColumnWidths = (state, columnWidth1, columnWidth2, columnWidth3) => {
  const paddingLeft = 15
  const { $Resizer1, $Resizer2 } = state
  $Resizer1.style.left = `${paddingLeft + columnWidth1}px`
  $Resizer2.style.left = `${paddingLeft + columnWidth1 + columnWidth2}px`
}

export const setInputFocused = (state, isFocused) => {
  const { $HiddenInput } = state
  if (isFocused) {
    $HiddenInput.focus()
  }
}

export const setInputSelection = (state, selectionStart, selectionEnd) => {
  const { $VirtualInputBoxCursor } = state
  SetBounds.setX($VirtualInputBoxCursor, selectionStart * 8)
}

export * from '../ViewletScrollable/ViewletScrollable.js'
export * from '../ViewletSizable/ViewletSizable.js'
