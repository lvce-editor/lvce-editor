import * as IpcChildWithMessagePort from '../IpcChildWithMessagePort/IpcChildWithMessagePort.ts'

export const handleMessagePort = (port: MessagePort) => {
  const ipc = IpcChildWithMessagePort.wrap(port)
  const handleMessage = (event: MessageEvent) => {
    const { data } = event

    console.log({ data })
  }
  ipc.onmessage = handleMessage
  ipc.send('ready')
}
