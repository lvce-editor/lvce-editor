import * as Exit from '../Exit/Exit.ts'
import * as GetVersionString from '../GetVersionString/GetVersionString.ts'
import * as Logger from '../Logger/Logger.ts'

export const handleCliArgs = async (argv) => {
  const versionString = GetVersionString.getVersionString()
  Logger.info(versionString)
  await Exit.exit()
}
