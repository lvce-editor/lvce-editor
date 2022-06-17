import * as Command from '../Command/Command.js'
import * as Open from './Open.js'

export const __initialize__ = () => {
  Command.register(1370, Open.openNativeFolder)
}
