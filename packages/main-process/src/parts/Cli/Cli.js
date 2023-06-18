const CliCommandType = require('../CliCommandType/CliCommandType.js')

const getModule = (parsedArgs) => {
  const arg0 = parsedArgs._[0]
  if (parsedArgs[CliCommandType.Help]) {
    return require('../CliHelp/CliHelp.js')
  }
  if (parsedArgs[CliCommandType.Version]) {
    return require('../CliVersion/CliVersion.js')
  }
  if (parsedArgs[CliCommandType.Web]) {
    return require('../CliWeb/CliWeb.js')
  }
  if (
    arg0 === CliCommandType.Install ||
    arg0 === CliCommandType.List ||
    arg0 === CliCommandType.Link ||
    arg0 === CliCommandType.Unlink ||
    parsedArgs[CliCommandType.Status]
  ) {
    return require('../CliForwardToSharedProcess/CliForwardToSharedProcess.js')
  }
  if (parsedArgs[CliCommandType.BuiltinSelfTest]) {
    return require('../CliBuiltinSelfTest/CliBuiltinSelfTest.js')
  }
  return undefined
}

exports.handleFastCliArgsMaybe = (parsedArgs) => {
  const module = getModule(parsedArgs)
  if (module) {
    return module.handleCliArgs(parsedArgs)
  }
  return false
}
