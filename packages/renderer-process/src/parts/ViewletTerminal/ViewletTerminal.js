import * as Assert from '../Assert/Assert.js'
import * as IsUint8Array from '../IsUint8Array/IsUint8Array.js'
import * as Terminal from '../Terminal/Terminal.js'
import * as OffscreenCanvas from '../OffscreenCanvas/OffscreenCanvas.js'
import * as ViewletTerminalEvents from './ViewletTerminalEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Terminal'
  return {
    $Viewlet,
    terminal: undefined,
  }
}

export const setTerminal = (state, canvasCursorId, canvasTextId) => {
  const canvasText = OffscreenCanvas.get(canvasTextId)
  const canvasCursor = OffscreenCanvas.create(canvasCursorId)
  const { $Viewlet } = state
  const terminal = Terminal.create({
    $Element: $Viewlet,
    handleKeyDown: (...args) => ViewletTerminalEvents.handleKeyDown({ target: $Viewlet }, ...args),
    // @ts-ignore
    handleBlur: (...args) => ViewletTerminalEvents.handleBlur({ target: $Viewlet }, ...args),
    handleMouseDown: (...args) => ViewletTerminalEvents.handleMouseDown({ target: $Viewlet }, ...args),
    background: `#1b2020`,
    foreground: 'white',
    canvasText,
    canvasCursor,
  })
  state.terminal = terminal
}

export const focusTextArea = (state) => {
  const { terminal } = state
  terminal.focusTextArea()
}

export const refresh = (state, context) => {
  // state.element.textContent = context.text
}

export const dispose = (state) => {
  // TODO unregister callback
  // SharedProcess.unregisterChannel(channel )

  window.removeEventListener('resize', state.handleUpdate)
}

export const focus = (state) => {
  Assert.object(state)
  const { terminal } = state
  terminal.focus()
}

export const reduceFocus = (state, action) => {}

// TODO what is this
export const reduceWrite = (state, action) => {
  const { terminal } = state
  Terminal.write(terminal, state)
}

export const reduce = (state, action) => {
  switch (action.type) {
    case 'write':
      return reduceWrite(state, action)
    case 'focus':
      return reduceFocus(state, action)
    default:
      break
  }
}

export const write = (state, data) => {
  if (!IsUint8Array.isUint8Array(data)) {
    throw new TypeError(`data must be of type Uint8Array`)
  }
  const { terminal } = state
  Terminal.write(terminal, data)
}

export const Commands = {
  9922: write,
}
