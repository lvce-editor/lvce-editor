const Platform = require('../Platform/Platform.js')
const ElectronApp = require('../ElectronApp/ElectronApp.js')
const ExitCode = require('../ExitCode/ExitCode.js')

const getHelpString = () => {
  return `${Platform.ProductName} v${Platform.version}

Usage:
  ${Platform.applicationName} [path]
`
}

const handleCliArgs = (parsedArgs) => {
  const helpString = getHelpString()
  console.info(helpString)
  ElectronApp.exit(ExitCode.Sucess)
  return true
}

exports.handleCliArgs = handleCliArgs
