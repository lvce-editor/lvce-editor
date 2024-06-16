import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const sendMessagePortToRendererProcess = async (port: MessagePort) => {
  await RendererWorker.invokeAndTransfer(
    [port],
    'SendMessagePortToRendererProcess.sendMessagePortToRendererProcess',
    port,
    'HandleMessagePort.handleMessagePort',
  )
}
