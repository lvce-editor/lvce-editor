const Electron = require('../Electron/Electron.js')

const handleCliArgs = (parsedArgs) => {
  const extension = parsedArgs._
  if (!extension) {
    console.info('extension is required')
  }
  const SharedProcess = require('../SharedProcess/SharedProcess.js')
  console.log({ parsedArgs })
  Electron.app.quit()
  return true
}

exports.handleCliArgs = handleCliArgs
