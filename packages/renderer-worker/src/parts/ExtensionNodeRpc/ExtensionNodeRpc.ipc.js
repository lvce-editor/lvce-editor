import * as ExtensionNodeRpc from './ExtensionNodeRpc.js'

export const name = 'ExtensionNodeRpc'

export const Commands = {
  create: ExtensionNodeRpc.create,
  createConnection: ExtensionNodeRpc.createConnection,
  dispose: ExtensionNodeRpc.dispose,
  invoke: ExtensionNodeRpc.invoke,
}
