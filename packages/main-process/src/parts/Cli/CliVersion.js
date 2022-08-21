const Electron = require('electron')
const Platform = require('../Platform/Platform.js')

const handleCliArgs = (parsedArgs) => {
  const version = Platform.getVersion()
  const commit = Platform.getCommit()
  console.info(`${version}
${commit}`)
  Electron.app.exit(0)
  return true
}

exports.handleCliArgs = handleCliArgs
