import * as WebSocketCapabilityRegistry from '../WebSocketCapabilityRegistry/WebSocketCapabilityRegistry.ts'

const allowedTargets = new Set([
  'clipboard-process',
  'file-system-process',
  'process-explorer',
  'search-process',
  'shared-process',
  'terminal-process',
])

export interface WebSocketConnectionInfo {
  readonly protocols: readonly string[]
  readonly url: string
}

const createConnectionInfo = (token: string): WebSocketConnectionInfo => {
  return {
    protocols: WebSocketCapabilityRegistry.getProtocols(token),
    url: '/websocket/capability',
  }
}

export const create = (target: string): WebSocketConnectionInfo => {
  if (!allowedTargets.has(target)) {
    throw new Error(`WebSocket target ${target} is not allowed`)
  }
  return createConnectionInfo(WebSocketCapabilityRegistry.create(target))
}

export const createExtensionNodeRpc = (extensionId: string, rpcId: string, modulePath: string): WebSocketConnectionInfo => {
  if (!extensionId || !rpcId || !modulePath) {
    throw new TypeError('extension node rpc capability requires extensionId, rpcId and modulePath')
  }
  return createConnectionInfo(
    WebSocketCapabilityRegistry.create('extension-host-helper-process', {
      extensionId,
      modulePath,
      rpcId,
    }),
  )
}

export const createLegacyExtensionNodeRpc = (modulePath: string): WebSocketConnectionInfo => {
  if (!modulePath) {
    throw new TypeError('legacy extension node rpc capability requires a modulePath')
  }
  return createConnectionInfo(
    WebSocketCapabilityRegistry.create('extension-host-helper-process', {
      modulePath,
    }),
  )
}
