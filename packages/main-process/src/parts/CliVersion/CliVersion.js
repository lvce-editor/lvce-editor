const ElectronApp = require('../ElectronApp/ElectronApp.cjs')
const ExitCode = require('../ExitCode/ExitCode.cjs')
const GetVersionString = require('../GetVersionString/GetVersionString.js')

const handleCliArgs = (parsedArgs) => {
  const versionString = GetVersionString.getVersionString()
  console.info(versionString)
  ElectronApp.exit(ExitCode.Sucess)
  return true
}

exports.handleCliArgs = handleCliArgs
