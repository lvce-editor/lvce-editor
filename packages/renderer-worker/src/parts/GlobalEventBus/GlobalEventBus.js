// TODO global event bus is probably a bad idea
// cons:
// 1. it is not typesafe
// 2. dependencies are unclear
//
// pros
// 1. it decouples event emitter (e.g. Editor creation) from other module (Document syncing when editor was created)

export const state = {
  listenerMap: Object.create(null),
}

export const emitEvent = async (event, ...args) => {
  const listeners = state.listenerMap[event] || []
  for (const listener of listeners) {
    await listener(...args)
  }
}

export const addListener = (event, fn) => {
  state.listenerMap[event] ||= []
  if (state.listenerMap[event].includes(fn)) {
    return
  }
  state.listenerMap[event].push(fn)
}

export const removeListener = (event, fn) => {
  const listeners = state.listenerMap[event]
  if (!listeners) {
    console.info(
      `[info] listener for event ${event} is not registered and cannot be unregistered`
    )
    return
  }
  const index = listeners.indexOf(fn)
  listeners.splice(index, 1)
  if (listeners.length === 0) {
    delete state.listenerMap[event]
  }
}
