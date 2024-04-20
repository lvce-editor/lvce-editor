import * as Listen from '../Listen/Listen.js'
import * as CommandState from '../CommandState/CommandState.js'
import * as CommandMap from '../CommandMap/CommandMap.js'

export const main = async () => {
  CommandState.registerCommands(CommandMap.commandMap)
  await Listen.listen()
}
