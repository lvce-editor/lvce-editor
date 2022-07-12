import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as FileSystemDisk from './FileSystemDisk.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as Assert from '../Assert/Assert.js'
import * as LocalStorage from '../LocalStorage/LocalStorage.js'

export const readFileInternal = async (getPath) => {
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

export const writeFileInternal = async (getPath, content) => {
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

    // @ts-ignore
    if (error.message.includes('ENOENT')) {
      try {
        const dirname = Workspace.pathDirName(path)
        await FileSystemDisk.mkdir(dirname)
        await FileSystemDisk.writeFile(path, content)
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
