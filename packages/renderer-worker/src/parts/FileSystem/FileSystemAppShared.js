import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as LocalStorage from '../LocalStorage/LocalStorage.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import { VError } from '../VError/VError.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as FileSystem from './FileSystem.js'

const readFileWeb = async (path, defaultContent) => {
  const content = await LocalStorage.getText(path)
  return content ?? defaultContent
}

const readJsonWeb = async (path, defaultContent) => {
  const content = await LocalStorage.getJson(path)
  return content ?? defaultContent
}

const readFileNode = async (path, defaultContent) => {
  // TODO handle enoent and other errors gracefully
  try {
    const userSettingsContent = await FileSystem.readFile(path)
    return userSettingsContent
  } catch (error) {
    // @ts-ignore
    if (error && error.code === ErrorCodes.ENOENT) {
      try {
        const dirname = Workspace.pathDirName(path)
        await FileSystem.mkdir(dirname)
        await FileSystem.writeFile(path, defaultContent)
        return defaultContent
      } catch (error) {
        throw new VError(error, `Failed to write ${path} `)
      }
    }
    throw new VError(error, `Failed to read ${path}`)
  }
}

const readJsonNode = async (path, defaultContent) => {
  // TODO handle enoent and other errors gracefully
  try {
    const userSettingsContent = await FileSystem.readJson(path)
    return userSettingsContent
  } catch (error) {
    // @ts-ignore
    if (error && error.code === ErrorCodes.ENOENT) {
      try {
        const dirname = Workspace.pathDirName(path)
        await FileSystem.mkdir(dirname)
        await FileSystem.writeFile(path, defaultContent)
        return defaultContent
      } catch (error) {
        throw new VError(error, `Failed to write ${path} `)
      }
    }
    throw new VError(error, `Failed to read ${path}`)
  }
}

export const readFileInternal = async (getPath, defaultContent = '') => {
  const path = await getPath()
  Assert.string(path)
  if (Platform.getPlatform() === PlatformType.Web) {
    return readFileWeb(path, defaultContent)
  }
  // TODO handle enoent and other errors gracefully
  return readFileNode(path, defaultContent)
}

export const readJsonInternal = async (getPath, defaultContent = '') => {
  const path = await getPath()
  Assert.string(path)
  if (Platform.getPlatform() === PlatformType.Web) {
    return readJsonWeb(path, defaultContent)
  }
  // TODO handle enoent and other errors gracefully
  return readJsonNode(path, defaultContent)
}

const writeFileWeb = async (path, content) => {
  if (Platform.getPlatform() === PlatformType.Web) {
    await Command.execute(/* LocalStorage.setText */ 'LocalStorage.setText', /* key */ path, /* value */ content)
  }
}

const writeFileNode = async (path, content) => {
  // TODO handle enoent and other errors gracefully
  try {
    await FileSystem.writeFile(path, content)
  } catch (error) {
    // TODO error should just have enoent code that could be checked

    // @ts-ignore
    if (error && error.code === ErrorCodes.ENOENT) {
      try {
        const dirname = Workspace.pathDirName(path)
        await FileSystem.mkdir(dirname)
        await FileSystem.writeFile(path, content)
        return
      } catch (error) {
        throw new VError(error, `Failed to write ${path}`)
      }
    }
    throw new VError(error, `Failed to write ${path}`)
  }
}

export const writeFileInternal = async (getPath, content) => {
  const path = await getPath()
  Assert.string(path)
  if (Platform.getPlatform() === PlatformType.Web) {
    return writeFileWeb(path, content)
  }
  return writeFileNode(path, content)
}
