// electron sends uint8arrays directly
// websocket sends the data as an object with data property
export const toUint8Array = (data) => {
  if (data instanceof Uint8Array) {
    return data
  }
  const actualData = data.data
  return new Uint8Array(actualData)
}
