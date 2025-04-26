const fileHandleCache = Object.create(null)

const getOrCreateFile = async (fileName) => {
  if (!fileHandleCache[fileName]) {
    const opfsRoot = await navigator.storage.getDirectory()
    const fileHandle = await opfsRoot.getFileHandle(fileName, {
      create: true,
    })
    fileHandleCache[fileName] = fileHandle
  }
  return fileHandleCache[fileName]
}

export const writeFile = async (fileName, content) => {
  const fileHandle = await getOrCreateFile(fileName)
  const writable = await fileHandle.createWritable()
  await writable.write(content)
  await writable.close()
}

export const readFile = async (fileName) => {
  const fileHandle = await getOrCreateFile(fileName)
  const file = await fileHandle.getFile()
  const text = await file.text()
  return text
}

export const clear = () => {
  // TODO
}
