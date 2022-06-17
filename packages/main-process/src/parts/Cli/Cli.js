const { fork, spawn } = require('child_process')
const minimist = require('minimist')
const Debug = require('../Debug/Debug.js')
const Platform = require('../Platform/Platform.js')
const Electron = require('../Electron/Electron.js')

exports.parseCliArgs = (argv) => {
  const CLI_OPTIONS = {
    boolean: ['version', 'help', 'wait', 'built-in-self-test', 'web'],
    alias: {
      version: 'v',
    },
  }
  Debug.debug('[info] parsing argv')
  const parsedArgs = minimist(argv.slice(1), CLI_OPTIONS)
  // TODO tree-shake this out
  if (argv[0].endsWith('dist/electron')) {
    parsedArgs['_'] = parsedArgs['_'].slice(1)
  }
  return parsedArgs
}

exports.handleFastCliArgsMaybe = (parsedArgs) => {
  if (parsedArgs.help) {
    console.info('TODO print help')
    Electron.app.exit(0)
    return true
  }
  if (parsedArgs.version) {
    const version = Platform.getVersion()
    const commit = Platform.getCommit()
    console.info(`${version}
${commit}`)
    Electron.app.exit(0)
    return true
  }
  if (parsedArgs.web) {
    const webPath = Platform.getWebPath()
    const child = spawn(process.argv[0], [webPath], {
      stdio: 'inherit',
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: '1',
      },
    })
    child.on('exit', () => {
      Electron.app.quit()
    })
    return true
  }
  if (parsedArgs['built-in-self-test']) {
    const builtinSelfTestPath = Platform.getBuiltinSelfTestPath()
    const child = fork(builtinSelfTestPath, {
      stdio: 'inherit',
      env: {
        ...process.env,
      },
    })
    child.on('exit', () => {
      Electron.app.quit()
    })
    return true
  }
  return false
}
