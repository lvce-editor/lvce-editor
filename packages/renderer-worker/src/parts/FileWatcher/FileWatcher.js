import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as Id from '../Id/Id.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as TestWorker from '../TestWorker/TestWorker.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const map = Object.create(null)
const ids = new WeakMap()

export const handleEvent = async (id, event) => {
  const eventTarget = map[id]
  if (!eventTarget) {
    const alternate = map2[id]
    if (alternate) {
      const ipc = TestWorker.get()
      if (!ipc) {
        return
      }
      await JsonRpc.invoke(ipc, alternate.callBackCommandId, event)
      return
    }
    console.warn(`target not found ${id}`)
    return
  }
  eventTarget.dispatchEvent(
    new CustomEvent('watcher-event', {
      detail: event,
    }),
  )
}

const createTarget = () => {
  const id = Id.create()
  const target = new EventTarget()
  map[id] = target
  ids.set(target, id)
  return target
}

const startWatch = async (target, options, requireReady = false) => {
  try {
    const result = await SharedProcess.invoke('FileWatcher.watch', ids.get(target), options)
    if (result?.ok === false || (requireReady && result?.ok !== true)) {
      throw new Error(result?.error?.message || 'File watcher did not become ready')
    }
    if (!ids.has(target)) throw new Error('File watcher was disposed during registration')
    return target
  } catch (error) {
    await dispose(target)
    throw error
  }
}

export const watch = async (options) => startWatch(createTarget(), options)

const extensionWatchers = new Map()

export const watchExtension = async (id, options) => {
  if (extensionWatchers.has(id)) throw new Error('File watcher is already registered')
  const target = createTarget()
  extensionWatchers.set(id, target)
  target.addEventListener('watcher-event', (event) => {
    void ExtensionManagementWorker.invoke('Extensions.handleFileWatcherEvent', id, event.detail).catch(console.error)
  })
  try {
    await startWatch(target, options, true)
  } catch (error) {
    if (extensionWatchers.get(id) === target) extensionWatchers.delete(id)
    throw error
  }
}

export const disposeExtension = async (id) => {
  const target = extensionWatchers.get(id)
  if (!target) return
  await dispose(target)
  extensionWatchers.delete(id)
}

export const dispose = async (target) => {
  const id = ids.get(target)
  if (id === undefined) {
    return
  }
  delete map[id]
  await SharedProcess.invoke('FileWatcher.dispose', id)
  ids.delete(target)
}

const map2 = Object.create(null)

export const watchFile = async (rpcId, callBackCommandId, uri) => {
  const id = Id.create()
  map2[id] = {
    rpcId,
    callBackCommandId,
  }
  // TODO use filesystem worker / file watcher worker
  await SharedProcess.invoke('FileWatcher.watchFile2', id, uri)
  return map[id]
}
