import * as CommandMap from '../CommandMap/CommandMap.js'
import * as CommandState from '../CommandState/CommandState.js'
import * as Listen from '../Listen/Listen.js'
import * as ProcessListeners from '../ProcessListeners/ProcessListeners.js'

export const main = async () => {
  process.on('uncaughtExceptionMonitor', ProcessListeners.handleUncaughtExceptionMonitor)
  process.on('disconnect', ProcessListeners.handleDisconnect)
  CommandState.registerCommands(CommandMap.commandMap)
  await Listen.listen()
}
