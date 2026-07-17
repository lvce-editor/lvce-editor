import * as Command from '../Command/Command.js'
import * as FileWatcher from '../FileWatcher/FileWatcher.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Workspace from '../Workspace/Workspace.js'

const RefreshDelay = 100

let watcher
let refreshTimeout
const deletedUris = new Set()

const isDeleteEvent = (eventName) => {
  return eventName === 'unlink' || eventName === 'unlinkDir'
}

const refresh = async () => {
  refreshTimeout = undefined
  const deleted = [...deletedUris]
  deletedUris.clear()
  await Promise.allSettled([
    Command.execute('Layout.handleWorkspaceRefresh', {
      deleted,
    }),
    Command.execute('Layout.refreshSourceControlBadgeCount'),
  ])
}

const scheduleRefresh = (event) => {
  if (isDeleteEvent(event.eventName)) {
    deletedUris.add(event.uri)
  }
  if (refreshTimeout !== undefined) {
    clearTimeout(refreshTimeout)
  }
  refreshTimeout = setTimeout(refresh, RefreshDelay)
}

const disposeWatcher = async () => {
  if (!watcher) {
    return
  }
  const oldWatcher = watcher
  watcher = undefined
  oldWatcher.removeEventListener('watcher-event', handleEvent)
  await FileWatcher.dispose(oldWatcher)
}

const handleEvent = (event) => {
  scheduleRefresh(event.detail)
}

export const watchWorkspace = async (workspaceUri) => {
  await disposeWatcher()
  if (!workspaceUri || !workspaceUri.startsWith('file://')) {
    return
  }
  watcher = await FileWatcher.watch({
    exclude: ['.git', 'node_modules'],
    roots: [workspaceUri],
  })
  watcher.addEventListener('watcher-event', handleEvent)
}

const handleWorkspaceChange = async () => {
  await watchWorkspace(Workspace.getWorkspaceUri())
}

export const hydrate = async () => {
  GlobalEventBus.addListener('workspace.change', handleWorkspaceChange)
  await watchWorkspace(Workspace.getWorkspaceUri())
}

export const dispose = async () => {
  GlobalEventBus.removeListener('workspace.change', handleWorkspaceChange)
  if (refreshTimeout !== undefined) {
    clearTimeout(refreshTimeout)
    refreshTimeout = undefined
  }
  deletedUris.clear()
  await disposeWatcher()
}
