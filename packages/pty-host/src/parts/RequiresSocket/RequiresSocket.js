const METHODS_THAT_REQUIRE_SOCKET = new Set([
  'Terminal.create',
  'HandleWebSocket.handleWebSocket',
  'HandleElectronMessagePort.handleElectronMessagePort',
])

export const requiresSocket = (method) => {
  return METHODS_THAT_REQUIRE_SOCKET.has(method)
}
