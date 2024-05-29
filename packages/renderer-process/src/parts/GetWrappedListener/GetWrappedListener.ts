import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const cache = new Map()

export const getWrappedListener = (listener, returnValue) => {
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
