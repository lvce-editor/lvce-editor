import * as Command from '../Command/Command.js'
import * as CommandInfo from './CommandInfo.js'

export const __initialize__ = () => {
  Command.register('CommandInfo.getCommandInfo', CommandInfo.getCommandInfo)
}
