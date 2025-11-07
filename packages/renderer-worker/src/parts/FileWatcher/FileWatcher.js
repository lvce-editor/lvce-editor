import * as Id from '../Id/Id.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const map = Object.create(null)

export const handleEvent = (id, event) => {
  const eventTarget = map[id]
  if (!eventTarget) {
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
  map[id] = new EventTarget()
  await SharedProcess.invoke('FileWatcher.watch', id, options)
  return map[id]
}

const map2 = Object.create(null)

export const watchFile = async (rpcId, callBackCommandId, uri) => {
  const id = Id.create()
  map2[id] = {
    rpcId,
    callBackCommandId,
  }
  // TODO use filesystem worker / file watcher worker
  await SharedProcess.invoke('FileWatcher.watch2', id, uri)
  return map[id]
}
