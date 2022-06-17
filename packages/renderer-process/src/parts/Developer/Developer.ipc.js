import * as Command from '../Command/Command.js'
import * as Developer from './Developer.js'

export const __initialize__ = () => {
  Command.register(283, Developer.showState)
  Command.register(284, Developer.getMemoryUsage)
}
