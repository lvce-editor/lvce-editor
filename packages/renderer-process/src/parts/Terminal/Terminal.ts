// @ts-ignore
import { createOffscreenTerminalDom } from '../../../../../static/js/termterm.js'

export const create = ({ $Element, ...options }) => {
  const terminal = createOffscreenTerminalDom($Element, options)
  return terminal
}

export const close = () => {}

// export const

export const write = (state, text) => {
  // state.terminal.write(text)
}

export const wrapTerminalCommand = (id) => {}
