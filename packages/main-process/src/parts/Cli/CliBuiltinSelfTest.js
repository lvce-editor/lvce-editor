const { fork } = require('child_process')
const Electron = require('../Electron/Electron.js')
const Platform = require('../Platform/Platform.js')

const handleBuiltinSelfTest = (parsedArgs) => {
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

exports.execute = handleBuiltinSelfTest
