const Id = {
  id: 1,
  create() {
    return this.id++
  },
}

export const create = (ipc) => {
  const callbacks = Object.create(null)
  const handleMessage = (message) => {
    if ('result' in message) {
      const callback = callbacks[message.id]
      callback(message)
      delete callbacks[message.id]
    }
  }
  ipc.on('message', handleMessage)
  return {
    invoke(method, params = {}) {
      const id = Id.create()
      const promise = new Promise((resolve, reject) => {
        callbacks[id] = resolve
      })
      ipc.send({
        method,
        id,
        params,
      })
      return promise
    },
  }
}
