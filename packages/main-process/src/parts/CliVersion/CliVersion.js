import * as ElectronApp from '../ElectronApp/ElectronApp.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as GetVersionString from '../GetVersionString/GetVersionString.js'

export const handleCliArgs = (parsedArgs) => {
  const versionString = GetVersionString.getVersionString()
  console.info(versionString)
  ElectronApp.exit(ExitCode.Sucess)
  return true
}
