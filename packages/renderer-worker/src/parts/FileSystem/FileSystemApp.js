import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as FileSystemDisk from './FileSystemDisk.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as Assert from '../Assert/Assert.js'
import * as LocalStorage from '../LocalStorage/LocalStorage.js'

export const name = 'App'

const readFileInternal = async (getPath) => {
  const path = await getPath()
  Assert.string(path)
  if (Platform.getPlatform() === 'web') {
    const settingsJsonContent = await LocalStorage.getText(path)
    if (settingsJsonContent) {
      return settingsJsonContent
    }
    const assetDir = Platform.getAssetDir()
    const url = `${assetDir}/config/defaultSettings.json`
    return Command.execute(/* Ajax.getText */ 'Ajax.getText', /* url */ url)
  }
  // TODO handle enoent and other errors gracefully
  const userSettingsContent = await FileSystemDisk.readFile(path)
  return userSettingsContent
}

// TODO ask preferences module to do this
const readFileSettingsJson = async () => {
  return readFileInternal(Platform.getUserSettingsPath)
}

const readFileRecentlyOpenedJson = async () => {
  return readFileInternal(Platform.getRecentlyOpenedPath)
}

export const readFile = (path) => {
  switch (path) {
    case 'app://startup-performance':
      return Command.execute(/* Developer.getStartupPerformanceContent */ 820)
    case 'app://memory-usage':
      return Command.execute(/* Developer.getMemoryUsageContent */ 821)
    case 'app://settings.json':
      return readFileSettingsJson()
    case 'app://recently-opened.json':
      return readFileRecentlyOpenedJson()
    default:
      return ''
  }
}

const writeFileInternal = async (getPath, content) => {
  const path = await getPath()
  Assert.string(path)
  if (Platform.getPlatform() === 'web') {
    await Command.execute(
      /* LocalStorage.setText */ 6904,
      /* key */ path,
      /* value */ content
    )
    return
  }
  // TODO handle enoent and other errors gracefully
  try {
    await FileSystemDisk.writeFile(path, content)
  } catch (error) {
    // TODO error should just have enoent code that could be checked

    if (error.message.includes('ENOENT')) {
      try {
        const dirname = Workspace.pathDirName(path)
        await FileSystemDisk.mkdir(dirname)
        await FileSystemDisk.writeFile(path, content)
      } catch (error) {
        error.message = `Failed to write ${path}: ${error.message}`
        throw error
      }
    } else {
      error.message = `Failed to write ${path}: ${error.message}`
      throw error
    }
  }
}

const writeFileSettingsJson = (content) => {
  return writeFileInternal(Platform.getUserSettingsPath, content)
}

const writeFileRecentlyOpenedJson = (content) => {
  return writeFileInternal(Platform.getRecentlyOpenedPath, content)
}

export const writeFile = async (path, content) => {
  switch (path) {
    case 'app://settings.json':
      // TODO in web write to local storage, in electron write to config file
      return writeFileSettingsJson(content)
    case 'app://startup-performance':
      break
    case 'app://recently-opened.json':
      return writeFileRecentlyOpenedJson(content)
    default:
      break
  }
}

export const readDirWithFileTypes = () => {
  return []
}

export const rename = async (oldUri, newUri) => {
  throw new Error('not allowed')
}

export const remove = async (path) => {
  throw new Error('not allowed')
}

export const mkdir = async (path) => {
  throw new Error('not allowed')
}

export const getPathSeparator = () => {
  return '/'
}
