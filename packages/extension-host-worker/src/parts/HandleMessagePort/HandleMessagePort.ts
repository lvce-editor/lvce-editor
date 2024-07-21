import * as IpcChildWithMessagePort from '../IpcChildWithMessagePort/IpcChildWithMessagePort.ts'

export const handleMessagePort = (port: MessagePort) => {
  const ipc = IpcChildWithMessagePort.wrap(port)
  const handleMessage = (event) => {
    console.log({ event })
  }
  ipc.onmessage = handleMessage
  console.log({ ipc })
}
