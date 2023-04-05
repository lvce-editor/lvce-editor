export const listen = () => {
  return process
}

export const wrap = (process) => {
  return {
    process,
    send(message) {
      this.process.send(message)
    },
    on(event, listener) {
      switch (event) {
        case 'message':
          this.process.on('message', listener)
          break
        default:
          throw new Error('unknown event listener type')
      }
    },
  }
}
