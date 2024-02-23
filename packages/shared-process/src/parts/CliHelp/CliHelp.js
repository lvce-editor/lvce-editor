import * as Exit from '../Exit/Exit.js'
import * as GetHelpString from '../GetHelpString/GetHelpString.js'
import * as Logger from '../Logger/Logger.js'

export const handleCliArgs = (parsedArgs) => {
  const helpString = GetHelpString.getHelpString()
  Logger.info(helpString)
  Exit.exit()
  return true
}
