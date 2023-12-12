import { setPriority } from 'node:os'
import * as Command from '../Command/Command.js'
import * as HandleUncaughtExceptionMonitor from '../HandleUncaughtExceptionMonitor/HandleUncaughtExceptionMonitor.js'
import * as Module from '../Module/Module.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as ProcessListeners from '../ProcessListeners/ProcessListeners.js'
import * as Signal from '../Signal/Signal.js'

export const main = async () => {
  Command.setLoad(Module.load)
  process.on('disconnect', ProcessListeners.handleDisconnect)
  process.on(Signal.SIGTERM, ProcessListeners.handleSigTerm)
  process.on('uncaughtExceptionMonitor', HandleUncaughtExceptionMonitor.handleUncaughtExceptionMonitor)
  await ParentIpc.listen()
  setPriority(process.pid, 19)
}
