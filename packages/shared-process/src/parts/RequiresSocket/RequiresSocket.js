// TODO find a better way to do this
// most commands don't require sockets
// but output channel and terminal need to continuously send data through the socket
const METHODS_THAT_REQUIRE_SOCKET = new Set([
  'OutputChannel.open',
  'ExtensionHost.start',
  'ExtensionHost.send',
])

export const requiresSocket = (method) => {
  return METHODS_THAT_REQUIRE_SOCKET.has(method)
}
