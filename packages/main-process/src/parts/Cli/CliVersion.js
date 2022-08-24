const Electron = require('electron')
const Platform = require('../Platform/Platform.js')

const handleCliArgs = (parsedArgs) => {
  const version = Platform.version
  const commit = Platform.commit
  console.info(`${version}
${commit}`)
  Electron.app.exit(0)
  return true
}

exports.handleCliArgs = handleCliArgs
