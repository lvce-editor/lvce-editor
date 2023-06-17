exports.listen = ({ messagePort }) => {
  return messagePort
}

const getActualData = (event) => {
  return event.data
}

exports.wrap = (messagePort) => {
  return {
    messagePort,
    on(event, listener) {
      if (event === 'message') {
        const wrappedListener = (event) => {
          const actualData = getActualData(event)
          listener(actualData)
        }
        this.messagePort.on(event, wrappedListener)
      } else {
        throw new Error('unsupported event type')
      }
    },
    off(event, listener) {
      this.messagePort.off(event, listener)
    },
    send(message) {
      this.messagePort.postMessage(message)
    },
    dispose() {
      this.messagePort.close()
    },
  }
}
