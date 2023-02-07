import * as CliCommandType from '../CliCommandType/CliCommandType.js'
import * as Logger from '../Logger/Logger.js'
import * as Process from '../Process/Process.js'

const getModule = (argv0) => {
  switch (argv0) {
    case CliCommandType.Install:
      return import('../CliInstall/CliInstall.js')
    case CliCommandType.List:
      return import('../CliList/CliList.js')
    case CliCommandType.Link:
      return import('../CliLink/CliLink.js')
    case CliCommandType.Unlink:
      return import('../CliUnlink/CliUnlink.js')
    default:
      throw new Error(`command not found ${argv0}`)
  }
}

export const handleCliArgs = async (argv) => {
  const argv0 = argv[0]
  const module = await getModule(argv0)
  // console.log('handle cli args')
  try {
    await module.handleCliArgs(argv)
  } catch (error) {
    Logger.error(error)
    Process.setExitCode(1)
  }
}
