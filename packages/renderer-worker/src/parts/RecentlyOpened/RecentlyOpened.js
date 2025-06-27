import * as AddToRecentlyOpened from '../AddToRecentlyOpened/AddToRecentlyOpened.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Logger from '../Logger/Logger.js'
import * as Workspace from '../Workspace/Workspace.js'

export * from '../AddToRecentlyOpened/AddToRecentlyOpened.js'
export * from '../ClearRecentlyOpened/ClearRecentlyOpened.js'
export * from '../GetRecentlyOpened/GetRecentlyOpened.js'
export * from '../SetRecentlyOpened/SetRecentlyOpened.js'

const addWorkspacePathToRecentlyOpened = async () => {
  const workspacePath = Workspace.getWorkspaceUri()
  if (!workspacePath) {
    return
  }
  // TODO add event listener that listens for workspace changes
  try {
    await AddToRecentlyOpened.addToRecentlyOpened(workspacePath)
  } catch (error) {
    Logger.error(error)
  }
}

// TODO if it is somehow possible to make this more efficient
export const hydrate = async () => {
  await addWorkspacePathToRecentlyOpened()
  GlobalEventBus.addListener('workspace.change', addWorkspacePathToRecentlyOpened)
}
