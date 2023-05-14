const METHODS_THAT_REQUIRE_SOCKET = new Set(['Terminal.create'])

export const requiresSocket = (method) => {
  return METHODS_THAT_REQUIRE_SOCKET.has(method)
}
