import { createTerminal } from '../../../../../static/js/termterm.js'

export const create = ({ $Element, ...options }) => {
  const state = {
    terminal: createTerminal($Element, options),
  }
  return state
}

export const close = () => {}

// export const

export const write = (state, text) => {
  state.terminal.write(text)
}

export const wrapTerminalCommand = (id) => {}
