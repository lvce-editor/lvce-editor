const { fork } = require('node:child_process')
const Electron = require('electron')
const Platform = require('../Platform/Platform.cjs')

const handleCliArgs = (parsedArgs) => {
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

exports.handleCliArgs = handleCliArgs
