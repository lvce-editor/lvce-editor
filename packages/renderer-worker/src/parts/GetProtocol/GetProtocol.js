import * as Character from '../Character/Character.js'
import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'

const RE_PROTOCOL = /^([a-z\-]+):\/\//

export const getProtocol = (uri) => {
  if (!uri) {
    return FileSystemProtocol.Disk
  }
  const protocolMatch = uri.match(RE_PROTOCOL)
  if (protocolMatch) {
    return protocolMatch[1]
  }
  return FileSystemProtocol.Disk
}

const PROTOCOL_POST_FIX_LENGTH = 3

export const getPath = (protocol, uri) => {
  if (protocol === FileSystemProtocol.Disk && !uri.startsWith('file://')) {
    return uri
  }
  if (protocol === Character.EmptyString) {
    return uri
  }
  return uri.slice(protocol.length + PROTOCOL_POST_FIX_LENGTH)
}
