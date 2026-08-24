import * as FileWatcher from '../FileWatcher/FileWatcher.js'
import * as GetPathDirName from '../GetPathDirName/GetPathDirName.js'
import * as PathToFileUri from '../PathToFileUri/PathToFileUri.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'

const ReloadDelay = 100

let reloadTimeout
let settingsUri = ''
let watcher

const scheduleReload = () => {
  if (reloadTimeout !== undefined) {
    clearTimeout(reloadTimeout)
  }
  reloadTimeout = setTimeout(async () => {
    reloadTimeout = undefined
    await Preferences.reload()
  }, ReloadDelay)
}

const handleEvent = (event) => {
  if (event.detail.uri !== settingsUri) {
    return
  }
  scheduleReload()
}

export const dispose = async () => {
  if (reloadTimeout !== undefined) {
    clearTimeout(reloadTimeout)
    reloadTimeout = undefined
  }
  if (!watcher) {
    return
  }
  const oldWatcher = watcher
  watcher = undefined
  oldWatcher.removeEventListener('watcher-event', handleEvent)
  await FileWatcher.dispose(oldWatcher)
}

export const hydrate = async () => {
  await dispose()
  if (Platform.getPlatform() === PlatformType.Web) {
    return
  }
  try {
    const settingsPath = await PlatformPaths.getUserSettingsPath()
    const settingsDirectory = GetPathDirName.getPathDirName(settingsPath)
    settingsUri = PathToFileUri.pathToFileUri(settingsPath)
    watcher = await FileWatcher.watch({
      exclude: [],
      roots: [PathToFileUri.pathToFileUri(settingsDirectory)],
    })
    watcher.addEventListener('watcher-event', handleEvent)
  } catch (error) {
    console.warn(`Failed to watch user settings: ${error}`)
  }
}
