import * as HandleUncaughtExceptionMonitor from '../HandleUncaughtExceptionMonitor/HandleUncaughtExceptionMonitor.js'
import * as Listen from '../Listen/Listen.js'

export const main = () => {
  process.on('uncaughtExceptionMonitor', HandleUncaughtExceptionMonitor.handleUncaughtExceptionMonitor)
  Listen.listen(process.argv)
  // process.on('message', HandleMessageFromParent.handleMessageFromParent)
  // if (process.send) {
  //   process.send('ready')
  // }
}
