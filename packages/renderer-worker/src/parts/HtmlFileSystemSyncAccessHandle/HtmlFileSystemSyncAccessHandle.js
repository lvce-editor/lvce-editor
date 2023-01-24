export const read = (handle) => {
  const fileSize = handle.getSize()
  const buffer = new DataView(new ArrayBuffer(fileSize))
  handle.read(buffer)
  const decoder = new TextDecoder()
  const text = decoder.decode(buffer)
  return text
}
