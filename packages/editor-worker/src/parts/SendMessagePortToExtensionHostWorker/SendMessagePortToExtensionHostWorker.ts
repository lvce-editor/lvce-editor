import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const sendMessagePortToExtensionHostWorker = async (port: MessagePort) => {
  await RendererWorker.invokeAndTransfer(
    [port],
    'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker',
    port,
    'HandleMessagePort.handleMessagePort',
  )
}
