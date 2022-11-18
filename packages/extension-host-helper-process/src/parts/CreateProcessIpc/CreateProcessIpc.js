export const createProcessIpc = (process) => {
  return {
    send(message) {
      process.send(message)
    },
    on(event, listener) {
      switch (event) {
        case 'message':
          process.on('message', listener)
          break
        default:
          throw new Error('unknown event listener type')
      }
    },
  }
}
