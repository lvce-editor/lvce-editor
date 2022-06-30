import * as Command from '../Command/Command.js'
import * as Developer from './Developer.js'

export const __initialize__ = () => {
  Command.register('Developer.showState', Developer.showState)
  Command.register('Developer.getMemoryUsage', Developer.getMemoryUsage)
}
