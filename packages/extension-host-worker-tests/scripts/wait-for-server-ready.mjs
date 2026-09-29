export const waitForServerReady = (server) => {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer)
      server.off('message', onMessage)
      server.off('error', onError)
      server.off('exit', onExit)
    }
    const onError = (error) => {
      cleanup()
      reject(error)
    }
    const onExit = (code, signal) => {
      onError(new Error(`Test server exited before listening (code ${code}, signal ${signal})`))
    }
    const onMessage = (message) => {
      if (message !== 'ready') return
      cleanup()
      resolve(undefined)
    }
    const timer = setTimeout(() => onError(new Error('Test server did not report readiness')), 30_000)
    server.on('message', onMessage)
    server.once('error', onError)
    server.once('exit', onExit)
  })
}
