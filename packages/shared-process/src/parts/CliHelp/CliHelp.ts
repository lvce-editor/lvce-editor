import * as Exit from '../Exit/Exit.ts'
import * as GetHelpString from '../GetHelpString/GetHelpString.ts'
import * as Logger from '../Logger/Logger.ts'

export const handleCliArgs = (parsedArgs: any): any => {
  const helpString = GetHelpString.getHelpString()
  Logger.info(helpString)
  Exit.exit()
  return true
}
