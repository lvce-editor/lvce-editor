const Electron = require('../Electron/Electron.js')

const handleCliArgs = (parsedArgs) => {
  console.info('TODO print help')
  Electron.app.exit(0)
  return true
}

exports.handleCliArgs = handleCliArgs
