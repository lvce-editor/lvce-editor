export const state = {
  /**
   * @type {MessagePort|undefined}
   */
  port: undefined,
}

export const send = (method, ...params) => {
  if (!state.port) {
    return
  }
  state.port.postMessage({
    jsonrpc: '2.0',
    method,
    params,
  })
}

const getPort = (type) => {
  return new Promise((resolve, reject) => {
    const handleMessageFromWindow = (event) => {
      const port = event.ports[0]
      resolve(port)
    }

    // @ts-ignore
    window.addEventListener('message', handleMessageFromWindow, {
      once: true,
    })
    // @ts-ignore
    window.myApi.ipcConnect(type)
  })
}

export const initialize = async () => {
  const port = await getPort('quickpick-browserview')
  state.port = port
  return port
}
