import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletTerminal from './ViewletTerminal.js'

// prettier-ignore
export const Commands = {
  'Terminal.clear': Viewlet.wrapViewletCommand(ViewletTerminal.name, ViewletTerminal.clear),
  'Terminal.write': Viewlet.wrapViewletCommand(ViewletTerminal.name, ViewletTerminal.write),
}

export * from './ViewletTerminal.js'
