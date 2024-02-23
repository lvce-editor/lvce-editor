import * as Exit from '../Exit/Exit.js'
import * as GetVersionString from '../GetVersionString/GetVersionString.js'
import * as Logger from '../Logger/Logger.js'

export const handleCliArgs = async (argv) => {
  const versionString = GetVersionString.getVersionString()
  Logger.info(versionString)
  await Exit.exit()
}
