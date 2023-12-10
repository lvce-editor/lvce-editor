import * as ElectronApp from '../ElectronApp/ElectronApp.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as GetHelpString from '../GetHelpString/GetHelpString.js'

export const handleCliArgs = (parsedArgs) => {
  const helpString = GetHelpString.getHelpString()
  console.info(helpString)
  ElectronApp.exit(ExitCode.Success)
  return true
}
