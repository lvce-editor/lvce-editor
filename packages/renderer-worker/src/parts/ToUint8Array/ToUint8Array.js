// electron sends uint8arrays directly
// websocket sends the data as an object with data property
// conpty sends the data as a string

export const toUint8Array = (data) => {
  if (data instanceof Uint8Array) {
    return data
  }
  if (typeof data === 'string') {
    return new TextEncoder().encode(data)
  }
  if (data.data) {
    const actualData = data.data
    return new Uint8Array(actualData)
  }
  throw new Error('unexpected data type')
}
