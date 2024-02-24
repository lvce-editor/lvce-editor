import * as CliCommandType from '../CliCommandType/CliCommandType.js'

/**
 * @enum {number}
 */
const ModuleId = {
  SharedProcess: 4,
  None: 0,
}

const getModule = (moduleId) => {
  switch (moduleId) {
    case ModuleId.SharedProcess:
      return import('../CliForwardToSharedProcess/CliForwardToSharedProcess.js')
    default:
      throw new Error('module not found')
  }
}

const getModuleId = (parsedArgs) => {
  const arg0 = parsedArgs._[0]
  if (
    arg0 === CliCommandType.Install ||
    arg0 === CliCommandType.List ||
    arg0 === CliCommandType.Link ||
    arg0 === CliCommandType.Unlink ||
    parsedArgs[CliCommandType.Status] ||
    parsedArgs[CliCommandType.Version] ||
    parsedArgs[CliCommandType.Help] ||
    parsedArgs[CliCommandType.Web] ||
    parsedArgs[CliCommandType.BuiltinSelfTest]
  ) {
    return ModuleId.SharedProcess
  }
  return ModuleId.None
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
