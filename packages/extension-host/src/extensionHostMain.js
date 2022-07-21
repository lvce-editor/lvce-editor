// TODO reduce extension host startup time (currently 100ms):
// 1. replace verror with native Error.cause (requires v8 v9.3)
// 2. load ow on demand (not sure)
// 3. figure out what else might be taking long (empty file takes just 30ms to execute), investigate what is done 70ms

import './suppress-experimental.js' // must be first import
import exitHook from 'exit-hook'
import * as Api from './parts/Api/Api.js'
import * as ExtensionManagement from './parts/ExtensionHostExtension/ExtensionHostExtension.js'
import * as SharedProcess from './parts/SharedProcess/SharedProcess.js'
import * as InternalCommand from './parts/InternalCommand/InternalCommand.js'

const canBeIgnored = (error) => {
  if (error && error.code === 'EPIPE') {
    console.info('[extension-host] epipe')
    // parent process is disposed, ignore
    return true
  }
  if (error && error.code === 'ERR_IPC_CHANNEL_CLOSED' && !process.connected) {
    console.info('[extension-host] ipc channel closed')
    // parent process is disposed, ignore
    return true
  }
  return false
}

const handleUncaughtExceptionMonitor = (error, origin) => {
  // TODO find out if there is a way to avoid EPIPE error alltogether
  if (canBeIgnored(error)) {
    return
  }

  // if(error && error.code ==='')
  console.info(
    '[extension host] Uncaught exception, more details should be below:'
  )
  console.error(error)
}

const handleUncaughtException = (error) => {
  if (canBeIgnored(error)) {
    return
  }
  process.exit(1)
}

// const handleDisconnect = () => {
//   console.info('[extension host] parent process disconnected')
//   ExtensionManagementImpl.runExitHooks()
//   process.exit()
// }

const handleBeforeExit = () => {
  console.info('[extension-host] before exit')
}

const handleDisconnect = () => {
  console.info('[extension-host] disconnected')
  // TODO add test for this
  process.exit(0)
}

const handleExit = () => {
  // console.info('[extension-host] exit')
}

const handleSigInt = () => {
  console.info('[extension-host] sigint')
}

const handleSigTerm = () => {
  // console.info('[extension-host] sigterm')
}

const handleSigPipe = () => {
  console.info('[extension-host] sigpipe')
}

const handleMessage = (message) => {
  console.info('[extension host] message', message)
}

const main = async () => {
  process.on('beforeExit', handleBeforeExit)
  process.on('disconnect', handleDisconnect)
  process.on('SIGINT', handleSigInt)
  process.on('uncaughtExceptionMonitor', handleUncaughtExceptionMonitor)
  process.on('exit', handleExit)
  process.on('uncaughtException', handleUncaughtException)
  process.on('SIGTERM', handleSigTerm)
  process.on('SIGPIPE', handleSigPipe)
  process.on('message', handleMessage)

  // process.on('disconnect', handleDisconnect)
  exitHook(ExtensionManagement.runExitHooks)
  globalThis.vscode = Api.vscode
  // TODO extension host can be initialized much faster
  // step 1: listen to shared process
  // step 2: when extension is activated, load whole extension api and extension commands

  console.log('hello from extension host')
  await SharedProcess.listen(InternalCommand)
}

main()
