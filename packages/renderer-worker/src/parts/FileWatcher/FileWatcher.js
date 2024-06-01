import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Id from '../Id/Id.js'

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
