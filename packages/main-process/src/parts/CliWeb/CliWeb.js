const { spawn } = require('node:child_process')
const Platform = require('../Platform/Platform.cjs')
const Electron = require('electron')
const Process = require('../Process/Process.cjs')

const handleCliArgs = (parsedArgs) => {
  const webPath = Platform.getWebPath()
  const child = spawn(Process.argv[0], [webPath], {
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

exports.handleCliArgs = handleCliArgs
