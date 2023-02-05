const minimist = require('minimist')
const Debug = require('../Debug/Debug.js')
const CliCommandType = require('../CliCommandType/CliCommandType.js')

exports.parseCliArgs = (argv) => {
  const CLI_OPTIONS = {
    boolean: [
      CliCommandType.Version,
      CliCommandType.Help,
      CliCommandType.Wait,
      CliCommandType.BuiltinSelfTest,
      CliCommandType.Web,
      CliCommandType.SandBox,
    ],
    alias: {
      version: 'v',
    },
    default: {
      sandbox: false,
    },
  }
  Debug.debug('[info] parsing argv')
  const relevantArgv = argv.slice(1)
  const parsedArgs = minimist(relevantArgv, CLI_OPTIONS)
  // TODO tree-shake this out
  if (argv[0].endsWith('dist/electron') || argv[0].endsWith('dist\\electron.exe')) {
    parsedArgs._ = parsedArgs._.slice(1)
  }
  return parsedArgs
}

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
  if (arg0 === CliCommandType.Install || arg0 === CliCommandType.List || arg0 === CliCommandType.Link || arg0 === CliCommandType.Unlink) {
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
