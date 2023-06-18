exports.isProtocolHandleApiSupported = (protocol) => {
  if (protocol.handle) {
    return true
  }
  return false
}
