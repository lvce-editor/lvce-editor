import * as Assert from '../Assert/Assert.js'
import * as Terminal from '../Terminal/Terminal.js'
import * as ViewletTerminalEvents from './ViewletTerminalEvents.js'

export const name = 'Terminal'

export const create = (id) => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Terminal'
  const terminal = Terminal.create({
    $Element: $Viewlet,
    handleInput: ViewletTerminalEvents.handleInput,
  })

  $Viewlet.addEventListener('focusin', ViewletTerminalEvents.handleFocus)

  return {
    $Viewlet,
    terminal,
  }
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
  const { terminal } = state
  Terminal.write(terminal, data)
}

export const Commands = {
  9922: write,
}
