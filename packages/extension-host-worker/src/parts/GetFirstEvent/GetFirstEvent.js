import * as Promises from '../Promises/Promises.js'

export const getFirstEvent = (eventTarget, eventMap) => {
  const { resolve, promise } = Promises.withResolvers()
  const listenerMap = Object.create(null)
  const cleanup = (value) => {
    for (const event of Object.keys(eventMap)) {
      eventTarget.removeEventListener(event, listenerMap[event])
    }
    resolve(value)
  }
  for (const [event, type] of Object.entries(eventMap)) {
    const listener = (event) => {
      cleanup({
        type,
        event,
      })
    }
    eventTarget.addEventListener(event, listener)
    listenerMap[event] = listener
  }
  return promise
}
