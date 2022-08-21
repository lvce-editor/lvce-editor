const Electron = require('../Electron/Electron.js')

const handleHelp = (parsedArgs) => {
  console.info('TODO print help')
  Electron.app.exit(0)
  return true
}

exports.handleHelp = handleHelp
