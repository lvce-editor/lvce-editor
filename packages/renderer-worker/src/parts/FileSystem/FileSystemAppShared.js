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

const handleReadError = async (error, path, defaultContent) => {
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
}

const readFileNode = async (path, defaultContent) => {
  // TODO handle enoent and other errors gracefully
  // TODO maybe avoid using try/catch for enoent errors and use values instead
  try {
    const userSettingsContent = await FileSystem.readFile(path)
    return userSettingsContent
  } catch (error) {
    return await handleReadError(error, path, defaultContent)
  }
}

const readJsonNode = async (path, defaultContent) => {
  // TODO handle enoent and other errors gracefully
  // TODO maybe avoid using try/catch for enoent errors and use values instead
  try {
    const userSettingsContent = await FileSystem.readJson(path)
    return userSettingsContent
  } catch (error) {
    await handleReadError(error, path, '')
    return defaultContent
  }
}

export const readFileInternal = async (getPath, defaultContent = '') => {
  const path = await getPath()
  Assert.string(path)
  if (Platform.platform === PlatformType.Web) {
    return readFileWeb(path, defaultContent)
  }
  // TODO handle enoent and other errors gracefully
  return readFileNode(path, defaultContent)
}

export const readJsonInternal = async (getPath, defaultContent = '') => {
  const path = await getPath()
  Assert.string(path)
  if (Platform.platform === PlatformType.Web) {
    const content = await readFileWeb(path, defaultContent)
    return JSON.parse(content)
  }
  const parsed = await readJsonNode(path, defaultContent)
  return parsed
}

const writeFileWeb = async (path, content) => {
  if (Platform.platform === PlatformType.Web) {
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
  if (Platform.platform === PlatformType.Web) {
    return writeFileWeb(path, content)
  }
  return writeFileNode(path, content)
}
