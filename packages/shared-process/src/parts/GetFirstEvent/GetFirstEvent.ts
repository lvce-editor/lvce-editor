import * as Promises from '../Promises/Promises.ts'

export const getFirstEvent = (eventEmitter: any, eventMap: any): any => {
  const { promise, resolve } = Promises.withResolvers()
  const listenerMap = Object.create(null)
  const cleanup = (value: any): any => {
    for (const event of Object.keys(eventMap)) {
      eventEmitter.off(event, listenerMap[event])
    }
    resolve(value)
  }
  for (const [event, type] of Object.entries(eventMap)) {
    const listener = (event: any): any => {
      cleanup({
        event,
        type,
      })
    }
    eventEmitter.on(event, listener)
    listenerMap[event] = listener
  }
  return promise
}
