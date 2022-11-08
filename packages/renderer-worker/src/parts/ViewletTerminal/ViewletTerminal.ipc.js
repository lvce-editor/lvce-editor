import * as ViewletTerminal from './ViewletTerminal.js'

// prettier-ignore
export const Commands = {
  clear: ViewletTerminal.clear,
  write: ViewletTerminal.write,
}

export const Css = [
  '/css/parts/ViewletTerminal.css',
  '/static/lib-css/termterm.css',
]

export * from './ViewletTerminal.js'
