export const listen = async () => {
  if (!process.send) {
    throw new Error('process.send must be defined')
  }
  process.send('ready')
  return process
}

const getActualData = (message, handle) => {
  if (handle) {
    return {
      ...message,
      params: [...message.params, handle],
    }
  }
  return message
}

export const wrap = (process) => {
  return {
    process,
    on(event, listener) {
      if (event === 'message') {
        const wrappedListener = (event, handle) => {
          const actualData = getActualData(event, handle)
          listener(actualData)
        }
        this.process.on(event, wrappedListener)
      } else if (event === 'close') {
        this.process.on('close', listener)
      } else {
        throw new Error('unsupported event type')
      }
    },
    off(event, listener) {
      this.process.off(event, listener)
    },
    send(message) {
      this.process.send(message)
    },
    dispose() {},
  }
}
