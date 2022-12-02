import * as Command from './parts/Command/Command.js'
import * as ErrorHandling from './parts/ErrorHandling/ErrorHandling.js'
import * as Module from './parts/Module/Module.js'
import * as ParentIpc from './parts/ParentIpc/ParentIpc.js'
import * as Process from './parts/Process/Process.js'
// TODO handle structure: one shared process multiple extension hosts

// TODO use named functions here

const handleDisconnect = () => {
  console.info('[shared process] disconnected')
}

// const handleBeforeExit = () => {
//   console.info('[shared process] will exit now')
// }

const handleSigTerm = () => {
  console.info('[shared-process] sigterm')
}

const knownCliArgs = ['install', 'list', 'link', 'unlink']

const main = async () => {
  Command.setLoad(Module.load)
  const argv = Process.argv.slice(2)
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

  process.on(
    'uncaughtExceptionMonitor',
    ErrorHandling.handleUncaughtExceptionMonitor
  )
  ParentIpc.listen()

  // ExtensionHost.start() // TODO start on demand, e.g. not when extensions should be disabled
}

main()

// TODO when browser reloads or opens in new tab how does the window know which folder to open?

// setTimeout(() => {
//   throw new Error('oops')
// }, 210)
