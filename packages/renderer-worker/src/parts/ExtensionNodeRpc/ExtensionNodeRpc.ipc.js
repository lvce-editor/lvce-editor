import * as ExtensionNodeRpc from './ExtensionNodeRpc.js'

export const name = 'ExtensionNodeRpc'

export const Commands = {
  createConnection: ExtensionNodeRpc.createConnection,
  createMessagePort: ExtensionNodeRpc.createMessagePort,
  supportsDirectConnection: ExtensionNodeRpc.supportsDirectConnection,
}
