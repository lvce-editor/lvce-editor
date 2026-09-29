import * as Command from '../Command/Command.js'
import * as FileWatcher from '../FileWatcher/FileWatcher.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Workspace from '../Workspace/Workspace.js'

const RefreshDelay = 100

let watcher
let refreshTimeout
const changedUris = new Set()
const deletedUris = new Set()

const isDeleteEvent = (eventName) => {
  return eventName === 'unlink' || eventName === 'unlinkDir'
}

const refresh = async () => {
  refreshTimeout = undefined
  const changed = [...changedUris]
  const deleted = [...deletedUris]
  changedUris.clear()
  deletedUris.clear()
  const changes = {}
  if (changed.length > 0) {
    changes.changed = changed
  }
  if (deleted.length > 0) {
    changes.deleted = deleted
  }
  await Promise.allSettled([Command.execute('Layout.handleWorkspaceRefresh', changes), Command.execute('Layout.refreshSourceControlBadgeCount')])
}

const scheduleRefresh = (event) => {
  if (isDeleteEvent(event.eventName)) {
    deletedUris.add(event.uri)
    changedUris.delete(event.uri)
  } else {
    changedUris.add(event.uri)
    deletedUris.delete(event.uri)
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
  await Command.execute('Layout.refreshSourceControlBadgeCount')
}

export const hydrate = async () => {
  if (Preferences.get('files.workspaceWatcher.enabled') !== true) {
    return
  }
  GlobalEventBus.addListener('workspace.change', handleWorkspaceChange)
  await watchWorkspace(Workspace.getWorkspaceUri())
}

export const dispose = async () => {
  GlobalEventBus.removeListener('workspace.change', handleWorkspaceChange)
  if (refreshTimeout !== undefined) {
    clearTimeout(refreshTimeout)
    refreshTimeout = undefined
  }
  changedUris.clear()
  deletedUris.clear()
  await disposeWatcher()
}
