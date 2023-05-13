export const listen = () => {
  // @ts-ignore
  const parentPort = process.parentPort
  if (!parentPort) {
    throw new Error('parent port must be defined')
  }
  parentPort.postMessage('ready')
  return parentPort
}

export const wrap = (parentPort) => {
  return {
    parentPort,
    on(event, listener) {
      this.parentPort.on(event, listener)
    },
    off(event, listener) {
      this.parentPort.off(event, listener)
    },
    send(message) {
      this.parentPort.postMessage(message)
    },
    dispose() {
      this.parentPort.close()
    },
  }
}
