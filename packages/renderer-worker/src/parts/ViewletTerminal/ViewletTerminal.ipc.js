import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletTerminal from './ViewletTerminal.js'

// prettier-ignore
export const Commands = {
  4870: Viewlet.wrapViewletCommand('Terminal', ViewletTerminal.write),
  4871: Viewlet.wrapViewletCommand('Terminal', ViewletTerminal.clear),
}

export const Css = ['/css/parts/ViewletTerminal.css']

export * from './ViewletTerminal.js'
