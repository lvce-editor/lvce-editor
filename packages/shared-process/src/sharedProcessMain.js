import { setPriority } from 'node:os'
import * as Command from './parts/Command/Command.js'
import * as Module from './parts/Module/Module.js'
import * as ParentIpc from './parts/ParentIpc/ParentIpc.js'
import * as ProcessListeners from './parts/ProcessListeners/ProcessListeners.js'
import * as Signal from './parts/Signal/Signal.js'

const main = async () => {
  Command.setLoad(Module.load)
  process.on('disconnect', ProcessListeners.handleDisconnect)
  process.on(Signal.SIGTERM, ProcessListeners.handleSigTerm)
  process.on('uncaughtExceptionMonitor', ProcessListeners.handleUncaughtExceptionMonitor)
  await ParentIpc.listen()
  setPriority(process.pid, 19)
}

main()
