export const listen = async () => {
  return process
}

export const wrap = (process) => {
  return {
    process,
    on(event, listener) {
      this.process.on(event, listener)
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
