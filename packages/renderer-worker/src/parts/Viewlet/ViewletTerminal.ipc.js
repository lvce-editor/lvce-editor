import * as Command from '../Command/Command.js'
import * as ViewletTerminal from './ViewletTerminal.js'
import * as Viewlet from './Viewlet.js'

export const __initialize__ = () => {
  Command.register(4870, Viewlet.wrapViewletCommand('Terminal', ViewletTerminal.write))
  Command.register(4871 , Viewlet.wrapViewletCommand('Terminal', ViewletTerminal.clear))
}
