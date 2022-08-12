import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletTerminal from './ViewletTerminal.js'

// prettier-ignore
export const Commands = {
  'Terminal.write': Viewlet.wrapViewletCommand('Terminal', ViewletTerminal.write),
  'Terminal.clear': Viewlet.wrapViewletCommand('Terminal', ViewletTerminal.clear),
}

export * from './ViewletTerminal.js'
