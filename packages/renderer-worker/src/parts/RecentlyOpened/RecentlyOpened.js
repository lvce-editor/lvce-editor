import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Json from '../Json/Json.js'
import * as Workspace from '../Workspace/Workspace.js'

// TODO maybe put this together with workspace

const isValid = (recentlyOpened) => {
  return recentlyOpened && Array.isArray(recentlyOpened)
}

export const getRecentlyOpened = async () => {
  try {
    const content = await FileSystem.readFile('app://recently-opened.json')
    const parsed = Json.parse(content)
    if (!isValid(parsed)) {
      return []
    }
    // TODO handle error gracefully if this is not an array of strings
    return parsed
  } catch (error) {
    // TODO should check for error.code
    if (error.message.includes('ENOENT')) {
      // ignore
    } else if (error.message.includes('failed to parse json')) {
      // ignore
    } else {
      error.message = `Failed to read recently opened: ${error.message}`
      console.warn(error)
    }
    return []
  }
}

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
  return [
    path,
    ...recentlyOpened.slice(0, index),
    ...recentlyOpened.slice(index + 1),
  ]
}

export const addToRecentlyOpened = async (path) => {
  const recentlyOpened = await getRecentlyOpened()
  const newRecentlyOpened = getNewRecentlyOpened(recentlyOpened, path)
  await setRecentlyOpened(newRecentlyOpened)
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
  GlobalEventBus.addListener(
    'workspace.change',
    addWorkspacePathToRecentlyOpened
  )
}
