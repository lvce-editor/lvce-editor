import * as ExtensionNodeRpc from './ExtensionNodeRpc.js'

export const name = 'ExtensionNodeRpc'

export const Commands = {
  create: ExtensionNodeRpc.create,
  dispose: ExtensionNodeRpc.dispose,
  invoke: ExtensionNodeRpc.invoke,
}
