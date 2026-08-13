import * as AssetDir from '../AssetDir/AssetDir.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'

// TODO move all of this to an extension

export const canBeRestored = true

export const name = 'Fetch'

export const state = {
  files: Object.create(null),
}

const fetchPrefix = 'fetch://'

const normalizeUri = (uri) => {
  if (uri.startsWith(fetchPrefix)) {
    return uri.slice(fetchPrefix.length)
  }
  return uri
}

const fetchAsset = async (uri) => {
  const response = await fetch(`${AssetDir.assetDir}${uri}`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response
}

export const readFile = async (uri) => {
  uri = normalizeUri(uri)
  if (uri.startsWith('localhost:') || uri.startsWith(location.host)) {
    return FileSystemWorker.invoke('FileSystem.readFile', `${location.protocol}//${uri}`)
  }
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return FileSystemWorker.invoke('FileSystemFetch.readFile', uri)
  }
  const response = await fetchAsset(uri)
  return response.text()
}

export const exists = async (uri) => {
  try {
    await readFile(uri)
    return true
  } catch {
    return false
  }
}

export const readJson = async (uri) => {
  uri = normalizeUri(uri)
  if (uri.startsWith('localhost:') || uri.startsWith(location.host)) {
    return FileSystemWorker.invoke('FileSystem.readJson', `${location.protocol}//${uri}`)
  }
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return FileSystemWorker.invoke('FileSystem.readJson', uri)
  }
  const response = await fetchAsset(uri)
  return response.json()
}

export const writeFile = (uri, content) => {
  uri = normalizeUri(uri)
  throw new Error('Fetch file systems are readonly')
}

export const mkdir = (uri) => {
  uri = normalizeUri(uri)
  throw new Error('Fetch file systems are readonly')
}

export const getPathSeparator = () => {
  return PathSeparatorType.Slash
}

export const isReadonly = () => {
  return true
}

export const remove = (uri) => {
  uri = normalizeUri(uri)
  throw new Error('Fetch file systems are readonly')
}

export const readDirWithFileTypes = async (uri) => {
  uri = normalizeUri(uri)
  const directoryPrefix = uri.endsWith(PathSeparatorType.Slash) ? uri : `${uri}${PathSeparatorType.Slash}`
  const response = await fetchAsset('/config/fileMap.json')
  const fileList = await response.json()
  const dirents = []
  for (const fileUri of fileList) {
    if (!fileUri.startsWith(directoryPrefix)) {
      continue
    }
    const rest = fileUri.slice(directoryPrefix.length)
    if (rest.includes(PathSeparatorType.Slash)) {
      const name = rest.slice(0, rest.indexOf(PathSeparatorType.Slash))
      if (dirents.some((dirent) => dirent.name === name)) {
        continue
      }
      dirents.push({
        name,
        type: DirentType.Directory,
      })
    } else {
      dirents.push({
        name: rest,
        type: DirentType.File,
      })
    }
  }
  return dirents
}

export const chmod = (path, permissions) => {
  path = normalizeUri(path)
  throw new Error('Fetch file systems are readonly')
}

export const getBlob = async (uri, type) => {
  uri = normalizeUri(uri)
  if (uri.startsWith('localhost:') || uri.startsWith(location.host)) {
    return FileSystemWorker.invoke('FileSystem.readFileAsBlob', `${location.protocol}//${uri}`, type)
  }
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return FileSystemWorker.invoke('FileSystem.readFileAsBlob', uri, type)
  }
  const response = await fetchAsset(uri)
  return response.blob()
}
