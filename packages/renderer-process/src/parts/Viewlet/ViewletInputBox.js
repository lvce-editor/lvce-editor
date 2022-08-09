import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const name = 'Input'

const handleDoubleClick = (event) => {
  RendererWorker.send('Input.handleDoubleClick')
}

const handleSingleClick = (event) => {
  const $Target = event.target
  const $InputText = $Target.firstChild
  const clientX = event.clientX
  const clientY = event.clientY
  const range = document.caretRangeFromPoint(clientX, clientY)
  const textNode = range.startContainer
  const offset = range.startOffset
  RendererWorker.send('Input.handleSingleClick', /* offset */ offset)
}

export const create = () => {
  // $InputBox.spellcheck = false
  // $InputBox.autocapitalize = 'off'
  // $InputBox.autocomplete = 'off' // TODO needed?
  // $InputBox.type = 'text'
  // $InputBox.setAttribute('autocorrect', 'off') // for ios
  const $InputText = document.createTextNode('')

  const $InputCursor = document.createElement('div')
  $InputCursor.className = 'Cursor'

  const $InputSelection = document.createElement('div')
  $InputSelection.className = 'Selection'

  const $InputBox = document.createElement('div')
  $InputBox.className = 'InputBox'
  $InputBox.setAttribute('role', 'textbox')
  $InputBox.ondblclick = handleDoubleClick
  $InputBox.onclick = handleSingleClick

  $InputBox.append($InputCursor, $InputSelection, $InputText)
  return { $InputBox, $InputText, $InputCursor, $InputSelection }
}

export const setCursorOffset = (state, cursorOffset) => {
  // TODO maybe implement two ways for applying cursor offset
  // 1. when it is a monospace font and ascii characters, compute the pixel offset with javascript (very fast)
  // 2. when it contains other characters, use getBoundingClientRange to compute exact offset
  const { $InputCursor, $InputText } = state
  // TODO this is slow as it causes synchronous layout
  const range = document.createRange()
  range.setStart($InputText, cursorOffset)
  range.setEnd($InputText, cursorOffset)
  const rect = range.getBoundingClientRect()
  const parentRect = $InputText.parentNode.getBoundingClientRect()
  const left = Math.round(rect.left - parentRect.left)
  $InputCursor.style.left = `${left}px`
}

export const setValue = (state, value) => {
  const { $InputText } = state
  $InputText.data = value
}

export const setCursorOffsetPx = (state, left) => {
  const { $InputCursor } = state
  $InputCursor.style.left = `${left}px`
}

export const setSelection = (state, selectionStart, selectionEnd) => {
  const { $InputCursor, $InputText, $InputSelection } = state
  // TODO this is slow as it causes synchronous layout
  const range = document.createRange()
  if (selectionStart === selectionEnd) {
    range.setStart($InputText, selectionStart)
    range.setEnd($InputText, selectionEnd)
    const rect = range.getBoundingClientRect()
    const parentRect = $InputText.parentNode.getBoundingClientRect()
    const left = Math.round(rect.left - parentRect.left)
    // @ts-ignore
    $InputCursor.style.left = CSS.px(left)
    // TODO remove from dom instead of settings display none
    $InputCursor.style.display = 'block'
    $InputSelection.style.display = 'none'
  } else {
    range.setStart($InputText, selectionStart)
    range.setEnd($InputText, selectionEnd)
    const rect = range.getBoundingClientRect()
    const parentRect = $InputText.parentNode.getBoundingClientRect()
    const start = Math.round(rect.left - parentRect.left)
    const end = Math.round(rect.right - parentRect.left)
    const width = end - start
    // @ts-ignore
    $InputSelection.style.left = CSS.px(start)
    // @ts-ignore
    $InputSelection.style.width = CSS.px(width)
    $InputSelection.style.display = 'block'
    $InputCursor.style.display = 'none'
  }
}
