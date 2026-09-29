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

export const watch = async (options) => {
  const id = Id.create()
  const target = new EventTarget()
  map[id] = target
  ids.set(target, id)
  await SharedProcess.invoke('FileWatcher.watch', id, options)
  return target
}

export const dispose = async (target) => {
  const id = ids.get(target)
  if (id === undefined) {
    return
  }
  ids.delete(target)
  delete map[id]
  await SharedProcess.invoke('FileWatcher.dispose', id)
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
