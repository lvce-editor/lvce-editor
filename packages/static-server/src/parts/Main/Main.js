import * as HandleMessageFromParent from '../HandleMessageFromParent/HandleMessageFromParent.js'
import * as HandleUncaughtExceptionMonitor from '../HandleUncaughtExceptionMonitor/HandleUncaughtExceptionMonitor.js'

export const main = () => {
  process.on('uncaughtExceptionMonitor', HandleUncaughtExceptionMonitor.handleUncaughtExceptionMonitor)
  process.on('message', HandleMessageFromParent.handleMessageFromParent)
  if (process.send) {
    process.send('ready')
  }
}
