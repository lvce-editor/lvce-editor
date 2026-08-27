import { PlainMessagePortRpcParent } from '../../../../../static/js/lvce-editor-rpc.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const forwardRendererProcessCommand = (method: string, ...params: readonly unknown[]): Promise<unknown> => {
  return RendererProcess.invoke(method, ...params)
}

const forwardSecretStorageCommand = (method: string, ...params: readonly unknown[]): Promise<unknown> => {
  return SharedProcess.invoke(method, ...params)
}

export const handleSecretsViewMessagePort = async (port: MessagePort): Promise<void> => {
  await PlainMessagePortRpcParent.create({
    commandMap: {
      'SecretStorage.get': (...params: readonly unknown[]) => forwardSecretStorageCommand('SecretStorage.get', ...params),
      'SecretStorage.list': (...params: readonly unknown[]) => forwardSecretStorageCommand('SecretStorage.list', ...params),
      'SecretStorage.store': (...params: readonly unknown[]) => forwardSecretStorageCommand('SecretStorage.store', ...params),
      'Viewlet.queueCommands': (...params: readonly unknown[]) => forwardRendererProcessCommand('Viewlet.queueCommands', ...params),
    },
    messagePort: port,
  })
}
