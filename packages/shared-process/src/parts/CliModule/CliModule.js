import * as CliCommandType from '../CliCommandType/CliCommandType.js'

export const getModule = (argv0) => {
  switch (argv0) {
    case CliCommandType.Install:
      return import('../CliInstall/CliInstall.js')
    case CliCommandType.List:
      return import('../CliList/CliList.js')
    case CliCommandType.Link:
      return import('../CliLink/CliLink.js')
    case CliCommandType.Unlink:
      return import('../CliUnlink/CliUnlink.js')
    case CliCommandType.Status:
      return import('../CliStatus/CliStatus.js')
    default:
      throw new Error(`command not found ${argv0}`)
  }
}
