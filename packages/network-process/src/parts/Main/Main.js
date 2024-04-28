import * as CommandMap from '../CommandMap/CommandMap.js'
import * as CommandState from '../CommandState/CommandState.js'
import * as Listen from '../Listen/Listen.js'

export const main = async () => {
  CommandState.registerCommands(CommandMap.commandMap)
  await Listen.listen()
}
