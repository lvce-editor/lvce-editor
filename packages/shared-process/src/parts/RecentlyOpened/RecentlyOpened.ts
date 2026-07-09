import { dirname } from 'node:path'
import * as Assert from '../Assert/Assert.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as Json from '../Json/Json.ts'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import { VError } from '../VError/VError.ts'

const addToArrayUnique = (recentlyOpened: any, path: any): any => {
  const index = recentlyOpened.indexOf(path)
  if (index === -1) {
    return [path, ...recentlyOpened]
  }
  return [path, ...recentlyOpened.slice(0, index), ...recentlyOpened.slice(index + 1)]
}

const getRecentlyOpened = async (recentlyOpenedPath: any): Promise<any> => {
  try {
    const parsed = await JsonFile.readJson(recentlyOpenedPath)
    return parsed
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      // ignore
    } else if (error && error.code === ErrorCodes.E_JSON_PARSE) {
      // ignore
    } else {
      throw new VError(error, `Failed to read recently opened`)
    }
    return []
  }
}

const setRecentlyOpened = async (recentlyOpenedPath: any, newRecentlyOpened: any): Promise<any> => {
  const stringified = Json.stringify(newRecentlyOpened)
  try {
    await FileSystem.writeFile(recentlyOpenedPath, stringified)
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      await FileSystem.mkdir(dirname(recentlyOpenedPath))
      await FileSystem.writeFile(recentlyOpenedPath, stringified)
      return
    }
    throw error
  }
}

export const addPath = async (path: any): Promise<any> => {
  try {
    Assert.string(path)
    const recentlyOpenedPath = PlatformPaths.getRecentlyOpenedPath()
    const parsed = await getRecentlyOpened(recentlyOpenedPath)
    const newRecentlyOpened = addToArrayUnique(parsed, path)
    await setRecentlyOpened(recentlyOpenedPath, newRecentlyOpened)
  } catch (error) {
    throw new VError(error, `Failed to add path to recently opened`)
  }
}
