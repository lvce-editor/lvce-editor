import { dirname } from 'node:path'
import * as Assert from '../Assert/Assert.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Json from '../Json/Json.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Platform from '../Platform/Platform.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import { VError } from '../VError/VError.js'

const addToArrayUnique = (recentlyOpened, path) => {
  const index = recentlyOpened.indexOf(path)
  if (index === -1) {
    return [path, ...recentlyOpened]
  }
  return [path, ...recentlyOpened.slice(0, index), ...recentlyOpened.slice(index + 1)]
}

const getRecentlyOpened = async (recentlyOpenedPath) => {
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

const setRecentlyOpened = async (recentlyOpenedPath, newRecentlyOpened) => {
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

export const addPath = async (path) => {
  try {
    Assert.string(path)
    const recentlyOpenedPath = Platform.getRecentlyOpenedPath()
    const parsed = await getRecentlyOpened(recentlyOpenedPath)
    const newRecentlyOpened = addToArrayUnique(parsed, path)
    await setRecentlyOpened(recentlyOpenedPath, newRecentlyOpened)
  } catch (error) {
    throw new VError(error, `Failed to add path to recently opened`)
  }
}
