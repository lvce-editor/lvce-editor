const RE_PROTOCOL = /^([a-z\-]+):\/\//

export const getProtocol = (uri) => {
  const protocolMatch = uri.match(RE_PROTOCOL)
  if (protocolMatch) {
    return protocolMatch[1]
  }
  return ''
}

const PROTOCOL_POST_FIX_LENGTH = 3

export const getPath = (protocol, uri) => {
  if (protocol === '') {
    return uri
  }
  return uri.slice(protocol.length + PROTOCOL_POST_FIX_LENGTH)
}
