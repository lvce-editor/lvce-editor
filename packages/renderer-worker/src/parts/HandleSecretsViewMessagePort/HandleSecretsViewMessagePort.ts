import { PlainMessagePortRpcParent } from '../../../../../static/js/lvce-editor-rpc.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SendMessagePortToMainProcess from '../SendMessagePortToMainProcess/SendMessagePortToMainProcess.js'

const forwardRendererProcessCommand = (method: string, ...params: readonly unknown[]): Promise<unknown> => {
  return RendererProcess.invoke(method, ...params)
}

export const handleSecretsViewMessagePort = async (port: MessagePort): Promise<void> => {
  await PlainMessagePortRpcParent.create({
    commandMap: {
      'SendMessagePortToMainProcess.sendMessagePortToMainProcess': SendMessagePortToMainProcess.sendMessagePortToMainProcess,
      'Viewlet.queueCommands': (...params: readonly unknown[]) => forwardRendererProcessCommand('Viewlet.queueCommands', ...params),
    },
    messagePort: port,
  })
}
