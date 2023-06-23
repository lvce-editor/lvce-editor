const METHODS_THAT_REQUIRE_SOCKET = new Set(['GetWindowId.getWindowId'])

exports.requiresSocket = (method) => {
  return METHODS_THAT_REQUIRE_SOCKET.has(method)
}
