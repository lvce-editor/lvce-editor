/**
 * @type {Record<string, FileSystemSyncAccessHandle>}
 */
const fileHandleCache = Object.create(null)

const getOrCreateFile = async (fileName) => {
  if (!fileHandleCache[fileName]) {
    const opfsRoot = await navigator.storage.getDirectory()
    const fileHandle = await opfsRoot.getFileHandle(fileName, {
      create: true,
    })
    const syncHandle = await fileHandle.createSyncAccessHandle()
    fileHandleCache[fileName] = syncHandle
  }
  return fileHandleCache[fileName]
}

export const writeFile = async (fileName, content) => {
  console.time('gethandle' + fileName)
  const fileHandle = await getOrCreateFile(fileName)
  console.timeEnd('gethandle' + fileName)
  console.time('write' + fileName)
  fileHandle.write(new TextEncoder().encode(content))
  console.timeEnd('write' + fileName)
  console.time('close' + fileName)
  fileHandle.flush()
  console.timeEnd('close' + fileName)
}

export const readFile = async (fileName) => {
  console.time('read' + fileName)
  const fileHandle = await getOrCreateFile(fileName)
  const size = fileHandle.getSize()
  const buffer = new Uint8Array(size)
  fileHandle.read(buffer, { at: 0 })
  const text = new TextDecoder().decode(buffer)
  console.timeEnd('read' + fileName)
  return text
}

export const clear = () => {
  // TODO
}
