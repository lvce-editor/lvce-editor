import * as WebSocketCapability from './WebSocketCapability.ts'

export const name = 'WebSocketCapability'

export const commandMap = {
  create: WebSocketCapability.create,
  createExtensionNodeRpc: WebSocketCapability.createExtensionNodeRpc,
  createLegacyExtensionNodeRpc: WebSocketCapability.createLegacyExtensionNodeRpc,
}
