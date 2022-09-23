import * as ParentIpc from './parts/ParentIpc/ParentIpc.js'
import * as PrettyError from './parts/PrettyError/PrettyError.js'

// TODO handle structure: one shared process multiple extension hosts

// TODO use named functions here

const firstErrorLine = (error) => {
  if (error.stack) {
    return error.stack.slice(0, error.stack.indexOf('\n'))
  }
  if (error.message) {
    return error.message
  }
  return `${error}`
}

const handleUncaughtExceptionMonitor = (error, origin) => {
  console.info(`[shared process] uncaught exception: ${firstErrorLine(error)}`)
  if (error && error.code === 'EPIPE' && !process.connected) {
    // parent process is disposed, ignore
    return
  }
  if (error && error.code === 'ERR_IPC_CHANNEL_CLOSED' && !process.connected) {
    // parent process is disposed, ignore
    return
  }
  // console.log(error)
  const prettyError = PrettyError.prepare(error)
  // console.error(prettyError.message)
  console.error(prettyError.codeFrame)
  console.error(prettyError.stack)
  process.exit(1)
}

const handleDisconnect = () => {
  console.info('[shared process] disconnected')
}

// const handleBeforeExit = () => {
//   console.info('[shared process] will exit now')
// }

const handleSigTerm = () => {
  console.info('[shared-process] sigterm')
}

const knownCliArgs = ['install', 'list']

const main = async () => {
  const argv = process.argv.slice(2)
  const argv0 = argv[0]
  if (knownCliArgs.includes(argv0)) {
    const module = await import('./parts/Cli/Cli.js')
    await module.handleCliArgs(argv, console, process)
    return
  }

  console.log('[shared process] started')
  // process.on('beforeExit', handleBeforeExit)
  process.on('disconnect', handleDisconnect)
  process.on('SIGTERM', handleSigTerm)

  process.on('uncaughtExceptionMonitor', handleUncaughtExceptionMonitor)
  ParentIpc.listen()

  // ExtensionHost.start() // TODO start on demand, e.g. not when extensions should be disabled
}

main()

// TODO when browser reloads or opens in new tab how does the window know which folder to open?

// setTimeout(() => {
//   throw new Error('oops')
// }, 210)
