import * as Command from '../Command/Command.js'
import * as Open from './Open.js'
import * as CommandId from '../CommandId/CommandId.js'

export const __initialize__ = () => {
  Command.register(CommandId.OPEN_OPEN_URL, Open.openUrl)
}
