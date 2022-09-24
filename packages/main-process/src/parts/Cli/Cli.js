const minimist = require('minimist')
const Debug = require('../Debug/Debug.js')

exports.parseCliArgs = (argv) => {
  const CLI_OPTIONS = {
    boolean: [
      'version',
      'help',
      'wait',
      'built-in-self-test',
      'web',
      'sandbox',
    ],
    alias: {
      version: 'v',
    },
    default: {
      sandbox: false,
    },
  }
  Debug.debug('[info] parsing argv')
  const parsedArgs = minimist(argv.slice(1), CLI_OPTIONS)
  // TODO tree-shake this out
  if (argv[0].endsWith('dist/electron')) {
    parsedArgs._ = parsedArgs._.slice(1)
  }
  return parsedArgs
}

const getModule = (parsedArgs) => {
  const arg0 = parsedArgs._[0]
  if (parsedArgs.help) {
    return require('../CliHelp/CliHelp.js')
  }
  if (parsedArgs.version) {
    return require('../CliVersion/CliVersion.js')
  }
  if (parsedArgs.web) {
    return require('../CliWeb/CliWeb.js')
  }
  if (arg0 === 'install') {
    return require('../CliForwardToSharedProcess/CliForwardToSharedProcess.js')
  }
  if (arg0 === 'list') {
    return require('../CliForwardToSharedProcess/CliForwardToSharedProcess.js')
  }
  if (arg0 === 'link') {
    return require('../CliForwardToSharedProcess/CliForwardToSharedProcess.js')
  }
  if (parsedArgs['built-in-self-test']) {
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
