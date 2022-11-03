export const listen = async (commandRegistry) => {
  if (!process.send) {
    throw new Error('process.send is not available')
  }
  process.send('ready')
  return {
    send(message) {
      // @ts-ignore
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
