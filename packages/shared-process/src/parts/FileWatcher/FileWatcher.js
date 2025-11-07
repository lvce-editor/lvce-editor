import * as FileWatcherProcess from '../FileWatcherProcess/FileWatcherProcess.js'
import * as Id from '../Id/Id.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const handleEvents = (id, ipc, event) => {
  JsonRpc.send(ipc, 'FileWatcher.handleEvent', id, event)
}

// handle the case when multiple windows create a file watcher with same id, ids should not collide
// TODO remove ipc and dispose file watcher when socket / messageport closes
const internalIdMap = Object.create(null)

export const watch = async (ipc, id, { roots, exclude }) => {
  const internalId = Id.create()
  internalIdMap[internalId] = { id, ipc }
  await FileWatcherProcess.invoke('FileWatcher.watchFolders', {
    id: internalId,
    roots,
    exclude,
  })
}

export const watchFile2 = async (ipc, id, uri) => {
  const internalId = Id.create()
  internalIdMap[internalId] = { id, ipc }
  await FileWatcherProcess.invoke('FileWatcher.watchFile2', internalId, uri)
}

export const handleChange = (event) => {
  const ref = internalIdMap[event.id]
  handleEvents(ref.id, ref.ipc, event)
}
