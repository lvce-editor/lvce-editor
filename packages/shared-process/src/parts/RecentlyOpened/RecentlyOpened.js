import { dirname } from 'path'
import VError from 'verror'
import * as Assert from '../Assert/Assert.js'
import { FileNotFoundError } from '../Error/FileNotFoundError.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Json from '../Json/Json.js'
import * as Platform from '../Platform/Platform.js'

const isValid = (recentlyOpened) => {
  return recentlyOpened && Array.isArray(recentlyOpened)
}

const addToArrayUnique = (recentlyOpened, path) => {
  const index = recentlyOpened.indexOf(path)
  if (index === -1) {
    return [path, ...recentlyOpened]
  }
  return [
    path,
    ...recentlyOpened.slice(0, index),
    ...recentlyOpened.slice(index + 1),
  ]
}

const getRecentlyOpened = async (recentlyOpenedPath) => {
  try {
    const content = await FileSystem.readFile(recentlyOpenedPath)
    const parsed = await Json.parse(content, recentlyOpenedPath)
    return parsed
  } catch (error) {
    // TODO should check for error.code
    if (error.message.includes('File not found')) {
      // ignore
    } else if (error.message.includes('Json Parsing Error')) {
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
    if (error && error instanceof FileNotFoundError) {
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
