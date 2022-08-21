const { spawn } = require('child_process')
const Platform = require('../Platform/Platform.js')
const Electron = require('../Electron/Electron.js')

const handleWeb = (parsedArgs) => {
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

exports.handleWeb = handleWeb
