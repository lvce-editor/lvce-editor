import * as CliCommandType from '../CliCommandType/CliCommandType.js'

/**
 * @enum {number}
 */
const ModuleId = {
  Help: 1,
  Version: 2,
  Web: 3,
  SharedProcess: 4,
  BuiltinSelfTest: 5,
}

const getModule = (moduleId) => {
  switch (moduleId) {
    case ModuleId.Help:
      return import('../CliHelp/CliHelp.js')
    case ModuleId.Web:
      return import('../CliWeb/CliWeb.js')
    case ModuleId.SharedProcess:
      return import('../CliForwardToSharedProcess/CliForwardToSharedProcess.js')
    case ModuleId.BuiltinSelfTest:
      return import('../CliBuiltinSelfTest/CliBuiltinSelfTest.js')
    default:
      throw new Error('module not found')
  }
}

const getModuleId = (parsedArgs) => {
  const arg0 = parsedArgs._[0]
  if (parsedArgs[CliCommandType.Help]) {
    return ModuleId.Help
  }
  if (parsedArgs[CliCommandType.Web]) {
    return ModuleId.Web
  }
  if (
    arg0 === CliCommandType.Install ||
    arg0 === CliCommandType.List ||
    arg0 === CliCommandType.Link ||
    arg0 === CliCommandType.Unlink ||
    parsedArgs[CliCommandType.Status] ||
    parsedArgs[CliCommandType.Version]
  ) {
    return ModuleId.SharedProcess
  }
  if (parsedArgs[CliCommandType.BuiltinSelfTest]) {
    return ModuleId.BuiltinSelfTest
  }
  return undefined
}

const handleArgs = async (moduleId, parsedArgs) => {
  const module = await getModule(moduleId)
  return module.handleCliArgs(parsedArgs)
}

export const handleFastCliArgsMaybe = (parsedArgs) => {
  const moduleId = getModuleId(parsedArgs)
  if (moduleId) {
    return handleArgs(moduleId, parsedArgs)
  }
  return false
}
