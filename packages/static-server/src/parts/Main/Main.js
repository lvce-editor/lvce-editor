import * as HandleUncaughtExceptionMonitor from '../HandleUncaughtExceptionMonitor/HandleUncaughtExceptionMonitor.js'
import * as Listen from '../Listen/Listen.js'

export const main = async () => {
  process.on('uncaughtExceptionMonitor', HandleUncaughtExceptionMonitor.handleUncaughtExceptionMonitor)
  await Listen.listen(process.argv)
}
