export const writeFile = async (fileName, content) => {
  const opfsRoot = await navigator.storage.getDirectory()
  const fileHandle = await opfsRoot.getFileHandle(fileName, {
    create: true,
  })
  const writable = await fileHandle.createWritable()
  await writable.write(content)
  await writable.close()
}

export const readFile = async (fileName) => {
  const opfsRoot = await navigator.storage.getDirectory()
  const fileHandle = await opfsRoot.getFileHandle(fileName, {
    create: true,
  })
  const file = await fileHandle.getFile()
  const text = await file.text()
  return text
}

export const clear = () => {
  // TODO
}
