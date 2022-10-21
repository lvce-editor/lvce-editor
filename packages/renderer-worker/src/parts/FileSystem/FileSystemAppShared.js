import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as FileSystemErrorCodes from '../FileSystemErrorCodes/FileSystemErrorCodes.js'
import * as LocalStorage from '../LocalStorage/LocalStorage.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as FileSystem from './FileSystem.js'

export const readFileInternal = async (getPath, defaultContent = '') => {
  const path = await getPath()
  Assert.string(path)
  if (Platform.platform === PlatformType.Web) {
    const settingsJsonContent = await LocalStorage.getText(path)
    if (settingsJsonContent) {
      return settingsJsonContent
    }
    const assetDir = Platform.getAssetDir()
    const url = `${assetDir}/config/defaultSettings.json`
    return Command.execute(/* Ajax.getText */ 'Ajax.getText', /* url */ url)
  }
  // TODO handle enoent and other errors gracefully
  try {
    const userSettingsContent = await FileSystem.readFile(path)
    return userSettingsContent
  } catch (error) {
    // @ts-ignore
    if (error && error.code === FileSystemErrorCodes.ENOENT) {
      const dirname = Workspace.pathDirName(path)
      await FileSystem.mkdir(dirname)
      await FileSystem.writeFile(path, defaultContent)
      return defaultContent
    }
    throw error
  }
}

export const writeFileInternal = async (getPath, content) => {
  const path = await getPath()
  Assert.string(path)
  if (Platform.platform === PlatformType.Web) {
    await Command.execute(
      /* LocalStorage.setText */ 'LocalStorage.setText',
      /* key */ path,
      /* value */ content
    )
    return
  }
  // TODO handle enoent and other errors gracefully
  try {
    await FileSystem.writeFile(path, content)
  } catch (error) {
    // TODO error should just have enoent code that could be checked

    // @ts-ignore
    if (error && error.code === FileSystemErrorCodes.ENOENT) {
      try {
        const dirname = Workspace.pathDirName(path)
        await FileSystem.mkdir(dirname)
        await FileSystem.writeFile(path, content)
      } catch (error) {
        // @ts-ignore
        error.message = `Failed to write ${path}: ${error.message}`
        throw error
      }
    } else {
      // @ts-ignore
      error.message = `Failed to write ${path}: ${error.message}`
      throw error
    }
  }
}
