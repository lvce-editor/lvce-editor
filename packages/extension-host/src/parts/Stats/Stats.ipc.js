import * as InternalCommand from '../InternalCommand/InternalCommand.js'
import * as Stats from './Stats.js'

export const __initialize__ = () => {
  InternalCommand.register('Stats.getMemoryInfo', Stats.getMemoryInfo)
}
