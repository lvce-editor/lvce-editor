import * as ElectronApp from '../ElectronApp/ElectronApp.cjs'
import * as ExitCode from '../ExitCode/ExitCode.cjs'
import * as GetVersionString from '../GetVersionString/GetVersionString.js'

export const handleCliArgs = (parsedArgs) => {
  const versionString = GetVersionString.getVersionString()
  console.info(versionString)
  ElectronApp.exit(ExitCode.Sucess)
  return true
}
