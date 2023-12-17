import * as FileSystem from '../FileSystem/FileSystem.js'
import * as IsValidRecentlyOpened from '../IsValidRecentlyOpened/IsValidRecentlyOpened.js'
import * as Json from '../Json/Json.js'
import * as Logger from '../Logger/Logger.js'
import { VError } from '../VError/VError.js'

export const getRecentlyOpened = async () => {
  try {
    const content = await FileSystem.readFile('app://recently-opened.json')
    const parsed = Json.parse(content)
    if (!IsValidRecentlyOpened.isValid(parsed)) {
      return []
    }
    // TODO handle error gracefully if this is not an array of strings
    return parsed
  } catch (error) {
    // TODO should check for error.code
    if (error && error instanceof Error && error.message.includes('File not found')) {
      // ignore
    } else if (error && error instanceof Error && error.message.includes('failed to parse json')) {
      // ignore
    } else {
      const vError = new VError(error, 'Failed to read recently opened')
      Logger.warn(vError)
    }
    return []
  }
}
