import * as Command from './parts/Command/Command.js'
import * as ErrorHandling from './parts/ErrorHandling/ErrorHandling.js'
import * as ExitCode from './parts/ExitCode/ExitCode.js'
import * as Module from './parts/Module/Module.js'
import * as ParentIpc from './parts/ParentIpc/ParentIpc.js'
import * as Process from './parts/Process/Process.js'
import * as Signal from './parts/Signal/Signal.js'
// TODO handle structure: one shared process multiple extension hosts

// TODO use named functions here

const handleDisconnect = () => {
  console.info('[shared process] disconnected')
  Process.exit(ExitCode.Success)
}

// const handleBeforeExit = () => {
//   console.info('[shared process] will exit now')
// }

const handleSigTerm = () => {
  console.info('[shared-process] sigterm')
  Process.exit(ExitCode.Success)
}

const knownCliArgs = ['install', 'list', 'link', 'unlink']

const main = async () => {
  Command.setLoad(Module.load)
  const argv = Process.argv.slice(2)
  const argv0 = argv[0]
  if (knownCliArgs.includes(argv0)) {
    const module = await import('./parts/Cli/Cli.js')
    await module.handleCliArgs(argv)
    return
  }
  // process.on('beforeExit', handleBeforeExit)
  process.on('disconnect', handleDisconnect)
  process.on(Signal.SIGTERM, handleSigTerm)
  process.on('uncaughtExceptionMonitor', ErrorHandling.handleUncaughtExceptionMonitor)
  await ParentIpc.listen()
}

main()
