export const create = ({ type }) => {
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
    if (typeof window.myApi === 'undefined') {
      reject(new Error(`Electron api was requested but is not available`))
    }
    // @ts-ignore
    window.myApi.ipcConnect(type)
  })
}
