export const name = 'Input'

export const create = () => {
  // $InputBox.spellcheck = false
  // $InputBox.autocapitalize = 'off'
  // $InputBox.autocomplete = 'off' // TODO needed?
  // $InputBox.type = 'text'
  // $InputBox.setAttribute('autocorrect', 'off') // for ios
  const $InputText = document.createTextNode('')

  const $InputCursor = document.createElement('div')
  $InputCursor.className = 'Cursor'

  const $InputBox = document.createElement('div')
  $InputBox.className = 'InputBox'
  $InputBox.setAttribute('role', 'textbox')

  $InputBox.append($InputText, $InputCursor)
  return { $InputBox, $InputText, $InputCursor }
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
  const { $InputCursor, $InputText } = state
  // TODO this is slow as it causes synchronous layout
  const range = document.createRange()
  range.setStart($InputText, selectionStart)
  range.setEnd($InputText, selectionEnd)
  const rect = range.getBoundingClientRect()
  const parentRect = $InputText.parentNode.getBoundingClientRect()
  const left = Math.round(rect.left - parentRect.left)
  $InputCursor.style.left = `${left}px`
}
