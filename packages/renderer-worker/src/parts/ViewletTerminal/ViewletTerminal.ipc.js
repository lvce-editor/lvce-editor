import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletTerminal from './ViewletTerminal.js'

// prettier-ignore
export const Commands = {
  'Terminal.clear': Viewlet.wrapViewletCommand('Terminal', ViewletTerminal.clear),
  'Terminal.write': Viewlet.wrapViewletCommand('Terminal', ViewletTerminal.write),
}

export * from './ViewletTerminal.js'
