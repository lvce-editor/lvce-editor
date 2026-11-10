import * as Command from '../Command/Command.js'
import * as FileWatcher from '../FileWatcher/FileWatcher.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Workspace from '../Workspace/Workspace.js'

const RefreshDelay = 100

let watcher
let watchGeneration = 0
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
  const generation = ++watchGeneration
  if (refreshTimeout !== undefined) clearTimeout(refreshTimeout)
  refreshTimeout = undefined
  changedUris.clear()
  deletedUris.clear()
  if (!watcher) {
    return generation
  }
  const oldWatcher = watcher
  watcher = undefined
  oldWatcher.removeEventListener('watcher-event', handleEvent)
  await FileWatcher.dispose(oldWatcher)
  return generation
}

const handleEvent = (event) => {
  scheduleRefresh(event.detail)
}

export const watchWorkspace = async (workspaceUri) => {
  const generation = await disposeWatcher()
  if (generation !== watchGeneration) return
  if (!workspaceUri || (!workspaceUri.startsWith('file://') && !workspaceUri.startsWith('remote-server://'))) {
    return
  }
  const nextWatcher = await FileWatcher.watch({
    exclude: ['.git', 'node_modules'],
    roots: [workspaceUri],
  })
  if (generation !== watchGeneration) {
    await FileWatcher.dispose(nextWatcher)
    return
  }
  watcher = nextWatcher
  watcher.addEventListener('watcher-event', handleEvent)
}

const handleWorkspaceChange = async () => {
  const uri = Workspace.getWorkspaceUri()
  if (uri?.startsWith('remote-server://') || Preferences.get('files.workspaceWatcher.enabled') === true) await watchWorkspace(uri)
  else await disposeWatcher()
  await Command.execute('Layout.refreshSourceControlBadgeCount')
}

export const hydrate = async () => {
  GlobalEventBus.addListener('workspace.change', handleWorkspaceChange)
  const uri = Workspace.getWorkspaceUri()
  if (uri?.startsWith('remote-server://') || Preferences.get('files.workspaceWatcher.enabled') === true) await watchWorkspace(uri)
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
