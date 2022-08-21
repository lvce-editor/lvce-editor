const Electron = require('../Electron/Electron.js')
const Platform = require('../Platform/Platform.js')

const handleVersion = (parsedArgs) => {
  const version = Platform.getVersion()
  const commit = Platform.getCommit()
  console.info(`${version}
${commit}`)
  Electron.app.exit(0)
  return true
}

exports.handleVersion = handleVersion
