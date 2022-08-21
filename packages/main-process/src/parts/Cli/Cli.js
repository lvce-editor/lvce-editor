const { fork, spawn } = require('child_process')
const minimist = require('minimist')
const Debug = require('../Debug/Debug.js')
const Platform = require('../Platform/Platform.js')
const Electron = require('../Electron/Electron.js')

exports.parseCliArgs = (argv) => {
  const CLI_OPTIONS = {
    boolean: [
      'version',
      'help',
      'wait',
      'built-in-self-test',
      'web',
      'install',
    ],
    alias: {
      version: 'v',
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
  if (parsedArgs.help) {
    return require('./CliHelp.js')
  }
  if (parsedArgs.version) {
    return require('./CliVersion.js')
  }
  if (parsedArgs.web) {
    return require('./CliWeb.js')
  }
  if (parsedArgs['install']) {
    return require('./CliInstall.js')
  }
  if (parsedArgs['built-in-self-test']) {
    return require('./CliBuiltinSelfTest.js')
  }
  return undefined
}

exports.handleFastCliArgsMaybe = (parsedArgs) => {
  if (parsedArgs.help) {
    return handleHelp(parsedArgs)
  }
  if (parsedArgs.version) {
    return handleVersion(parsedArgs)
  }
  if (parsedArgs.web) {
    return handleWeb(parsedArgs)
  }
  if (parsedArgs['install']) {
    return handleInstall(parsedArgs)
  }
  if (parsedArgs['built-in-self-test']) {
    return handleBuiltinSelfTest(parsedArgs)
  }
  return false
}
