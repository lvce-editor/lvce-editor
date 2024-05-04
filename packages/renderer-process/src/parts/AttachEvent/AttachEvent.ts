import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as GetEventListeneroptions from '../GetEventListenerOptions/GetEventListenerOptions.ts'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const cache = new Map()

const getWrappedListener = (listener, returnValue) => {
  if (!returnValue) {
    return listener
  }
  if (!cache.has(listener)) {
    const wrapped = (event) => {
      const uid = ComponentUid.fromEvent(event)
      const result = listener(event)
      // TODO check for empty array by value
      if (result.length === 0) {
        return
      }
      RendererWorker.send('Viewlet.executeViewletCommand', uid, ...result)
    }
    NameAnonymousFunction.nameAnonymousFunction(wrapped, listener.name)
    cache.set(listener, wrapped)
  }
  return cache.get(listener)
}

export const attachEvent = ($Node, eventMap, key, value) => {
  const listener = eventMap[value]
  if (!listener) {
    console.warn('listener not found', value)
    return
  }
  const options = GetEventListeneroptions.getEventListenerOptions(eventMap)
  const wrapped = getWrappedListener(listener, eventMap.returnValue)
  $Node.addEventListener(key, wrapped, options)
}
