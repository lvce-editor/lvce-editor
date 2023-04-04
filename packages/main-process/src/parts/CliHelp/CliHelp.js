const ElectronApp = require('../ElectronApp/ElectronApp.js')
const ExitCode = require('../ExitCode/ExitCode.js')
const GetHelpString = require('../GetHelpString/GetHelpString.js')

const handleCliArgs = (parsedArgs) => {
  const helpString = GetHelpString.getHelpString()
  console.info(helpString)
  ElectronApp.exit(ExitCode.Sucess)
  return true
}

exports.handleCliArgs = handleCliArgs
