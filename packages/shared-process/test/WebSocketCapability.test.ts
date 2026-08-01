import { afterEach, expect, test } from '@jest/globals'
import * as WebSocketCapability from '../src/parts/WebSocketCapability/WebSocketCapability.ts'
import * as WebSocketCapabilityRegistry from '../src/parts/WebSocketCapabilityRegistry/WebSocketCapabilityRegistry.ts'

afterEach(() => {
  WebSocketCapabilityRegistry.clear()
})

const consumeDescriptor = (descriptor: WebSocketCapability.WebSocketConnectionInfo): WebSocketCapabilityRegistry.WebSocketCapability | undefined => {
  const tokenProtocol = descriptor.protocols.find((protocol) => protocol.startsWith(WebSocketCapabilityRegistry.capabilityProtocolPrefix)) || ''
  return WebSocketCapabilityRegistry.consume(tokenProtocol.slice(WebSocketCapabilityRegistry.capabilityProtocolPrefix.length))
}

test('binds isolated node rpc identity and resolved module path into the capability', () => {
  const descriptor = WebSocketCapability.createExtensionNodeRpc('builtin.git', 'git-client', '/extensions/builtin.git/client.js')

  expect(consumeDescriptor(descriptor)).toEqual(
    expect.objectContaining({
      extensionId: 'builtin.git',
      modulePath: '/extensions/builtin.git/client.js',
      rpcId: 'git-client',
      target: 'extension-host-helper-process',
    }),
  )
})

test('keeps trusted legacy node rpc on the preloaded capability route', () => {
  const descriptor = WebSocketCapability.createLegacyExtensionNodeRpc('/extensions/legacy/client.js')

  expect(consumeDescriptor(descriptor)).toEqual(
    expect.objectContaining({
      modulePath: '/extensions/legacy/client.js',
      target: 'extension-host-helper-process',
    }),
  )
})
