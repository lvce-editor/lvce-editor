import * as HandleUncaughtExceptionMonitor from '../HandleUncaughtExceptionMonitor/HandleUncaughtExceptionMonitor.ts'
import * as Listen from '../Listen/Listen.ts'

export const main = async () => {
  process.on('uncaughtExceptionMonitor', HandleUncaughtExceptionMonitor.handleUncaughtExceptionMonitor)
  await Listen.listen(process.argv)
}
