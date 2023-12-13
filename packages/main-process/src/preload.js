const { ipcRenderer, contextBridge } = require('electron')

const mainProcess = {
  addEventListener(eventType, listener) {
    const wrapped = (event, message) => {
      listener({ data: message, ports: event.ports })
    }
    ipcRenderer.on('port', wrapped)
  },
  postMessage(message, transfer) {
    ipcRenderer.postMessage('port', message, transfer)
  },
}

const forwardMessages = (from, to) => {
  const handleMessage = (event) => {
    const { data, ports } = event
    console.log({ event })
    to.postMessage(data, ports)
  }
  from.addEventListener('message', handleMessage, { once: true })
}

const main = () => {
  // @ts-ignore
  forwardMessages(mainProcess, window)
  // @ts-ignore
  forwardMessages(window, mainProcess)
  contextBridge.exposeInMainWorld('isElectron', true)
}

main()
