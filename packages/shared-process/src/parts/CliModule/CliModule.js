import * as Assert from '../Assert/Assert.js'
import * as CliCommandType from '../CliCommandType/CliCommandType.js'

export const getModule = (parsedArgs) => {
  Assert.object(parsedArgs)
  if (parsedArgs[CliCommandType.Status]) {
    return import('../CliStatus/CliStatus.js')
  }
  if (parsedArgs[CliCommandType.Version]) {
    return import('../CliVersion/CliVersion.js')
  }
  if (parsedArgs[CliCommandType.Help]) {
    return import('../CliHelp/CliHelp.js')
  }
  const argv0 = parsedArgs._[0]
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
