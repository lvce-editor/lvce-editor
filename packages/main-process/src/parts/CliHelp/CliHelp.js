import * as ElectronApp from '../ElectronApp/ElectronApp.cjs'
import * as ExitCode from '../ExitCode/ExitCode.cjs'
import * as GetHelpString from '../GetHelpString/GetHelpString.js'

export const handleCliArgs = (parsedArgs) => {
  const helpString = GetHelpString.getHelpString()
  console.info(helpString)
  ElectronApp.exit(ExitCode.Sucess)
  return true
}
