import prettyBytesLib from 'pretty-bytes'
import bytes from 'bytes'

export const format = (bytes) => {
  return prettyBytesLib(bytes)
}

export const parse = (prettyBytes) => {
  return bytes(prettyBytes)
}
