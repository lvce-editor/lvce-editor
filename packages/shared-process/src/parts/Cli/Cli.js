import * as Logger from '../Logger/Logger.js'
import * as Process from '../Process/Process.js'

const getModule = (argv0) => {
  switch (argv0) {
    case 'install':
      return import('../CliInstall/CliInstall.js')
    case 'list':
      return import('../CliList/CliList.js')
    case 'link':
      return import('../CliLink/CliLink.js')
    case 'unlink':
      return import('../CliUnlink/CliUnlink.js')
    default:
      throw new Error(`command not found ${argv0}`)
  }
}

export const handleCliArgs = async (argv, console, process) => {
  const argv0 = argv[0]
  const module = await getModule(argv0)
  // console.log('handle cli args')
  try {
    await module.handleCliArgs(argv, console, process)
  } catch (error) {
    Logger.error(error)
    Process.setExitCode(1)
  }
}
