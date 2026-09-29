import * as Url from '../Url/Url.js'

const blobProtocol = 'blob:'

export const create = (favicon) => {
  if (!favicon || typeof favicon !== 'object' || !(favicon.bytes instanceof Uint8Array)) {
    return typeof favicon === 'string' ? favicon : ''
  }
  const blob = new Blob([favicon.bytes], { type: favicon.mimeType })
  return Url.createObjectUrl(blob)
}

export const getSource = (favicon) => {
  if (favicon && typeof favicon === 'object') {
    return typeof favicon.url === 'string' ? favicon.url : ''
  }
  return typeof favicon === 'string' ? favicon : ''
}

export const dispose = (favicon) => {
  if (typeof favicon === 'string' && favicon.startsWith(blobProtocol)) {
    Url.revokeObjectUrl(favicon)
  }
}
