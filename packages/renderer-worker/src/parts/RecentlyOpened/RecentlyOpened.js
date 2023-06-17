import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GetRecentlyOpened from '../GetRecentlyOpened/GetRecentlyOpened.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Json from '../Json/Json.js'
import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const getRecentlyOpened = GetRecentlyOpened.getRecentlyOpened

const setRecentlyOpened = async (newRecentlyOpened) => {
  const stringified = Json.stringify(newRecentlyOpened)
  await FileSystem.writeFile('app://recently-opened.json', stringified)
}

export const clearRecentlyOpened = async () => {
  await setRecentlyOpened([])
}

const getNewRecentlyOpened = (recentlyOpened, path) => {
  const index = recentlyOpened.indexOf(path)
  if (index === -1) {
    return [path, ...recentlyOpened]
  }
  return [path, ...recentlyOpened.slice(0, index), ...recentlyOpened.slice(index + 1)]
}

const addToRecentlyOpenedWeb = async (path) => {
  const recentlyOpened = await getRecentlyOpened()
  const newRecentlyOpened = getNewRecentlyOpened(recentlyOpened, path)
  await setRecentlyOpened(newRecentlyOpened)
}

const addToRecentlyOpenedRemote = async (path) => {
  await SharedProcess.invoke(SharedProcessCommandType.RecentlyOpenedAddPath, path)
}

export const addToRecentlyOpened = async (path) => {
  switch (Platform.platform) {
    case PlatformType.Electron:
    case PlatformType.Remote:
      return addToRecentlyOpenedRemote(path)
    case PlatformType.Web:
      return addToRecentlyOpenedWeb(path)
    default:
      return
  }
}

const addWorkspacePathToRecentlyOpened = async () => {
  const workspacePath = Workspace.getWorkspacePath()
  if (!workspacePath) {
    return
  }
  // TODO add event listener that listens for workspace changes
  try {
    await addToRecentlyOpened(workspacePath)
  } catch {
    // ignore
  }
}

// TODO if it is somehow possible to make this more efficient
export const hydrate = async () => {
  await addWorkspacePathToRecentlyOpened()
  GlobalEventBus.addListener('workspace.change', addWorkspacePathToRecentlyOpened)
}
