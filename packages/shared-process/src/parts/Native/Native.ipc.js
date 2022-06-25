import * as Command from '../Command/Command.js'
import * as Native from './Native.js'

export const __initialize__ = () => {
  Command.register('Native.openFolder', Native.openFolder)
}
