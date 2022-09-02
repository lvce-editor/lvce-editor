const Electron = require('electron')
const Platform = require('../Platform/Platform.js')

const getHelpString = () => {
  return `${Platform.ProductName} v${Platform.version}

Usage:
  ${Platform.applicationName} [path]
`
}

const handleCliArgs = (parsedArgs) => {
  const helpString = getHelpString()
  console.info(helpString)
  Electron.app.exit(0)
  return true
}

exports.handleCliArgs = handleCliArgs
