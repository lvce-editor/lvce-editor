import * as DirentType from '../DirentType/DirentType.js'
import { FileNotFoundError } from '../FileNotFoundError/FileNotFoundError.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'

export const name = 'Memory'

const files = Object.create(null)
const memfsPrefix = 'memfs://'

const getPath = (uri) => (uri.startsWith(memfsPrefix) ? uri.slice(memfsPrefix.length) : uri)

const getDirent = (uri) => files[getPath(uri)] || files[`${getPath(uri)}/`]

const ensureParentDirs = (uri) => {
  let endIndex = uri.indexOf(PathSeparatorType.Slash)
  while (endIndex >= 0) {
    files[uri.slice(0, endIndex + 1)] ||= { content: '', type: DirentType.Directory }
    endIndex = uri.indexOf(PathSeparatorType.Slash, endIndex + 1)
  }
}

export const readFile = (uri) => {
  const path = getPath(uri)
  const dirent = files[path]
  if (!dirent) {
    throw new FileNotFoundError(path)
  }
  if (dirent.type !== DirentType.File) {
    throw new Error('file is a directory')
  }
  return dirent.content
}

export const exists = (uri) => Boolean(getDirent(uri))

export const writeFile = (uri, content) => {
  const path = getPath(uri)
  ensureParentDirs(path)
  files[path] = { content, type: DirentType.File }
}

export const createFile = (uri) => writeFile(uri, '')

export const mkdir = (uri) => {
  let path = getPath(uri)
  if (!path.endsWith(PathSeparatorType.Slash)) {
    path += PathSeparatorType.Slash
  }
  ensureParentDirs(path)
  files[path] = { content: '', type: DirentType.Directory }
}

export const isReadonly = () => false

export const remove = (uri) => {
  const path = getPath(uri)
  for (const key of Object.keys(files)) {
    if (key === path || key === `${path}/` || key.startsWith(`${path}/`)) {
      delete files[key]
    }
  }
}

export const readDirWithFileTypes = (uri) => {
  let path = getPath(uri)
  if (path && !path.endsWith(PathSeparatorType.Slash)) {
    path += PathSeparatorType.Slash
  }
  const entries = new Map()
  for (const [key, value] of Object.entries(files)) {
    if (!key.startsWith(path) || key === path) {
      continue
    }
    const rest = key.slice(path.length)
    const slashIndex = rest.indexOf(PathSeparatorType.Slash)
    if (slashIndex >= 0) {
      entries.set(rest.slice(0, slashIndex), DirentType.Directory)
    } else {
      entries.set(rest, value.type)
    }
  }
  return [...entries].map(([entryName, type]) => ({ name: entryName, type }))
}

export const getBlob = (uri, type = '') => new Blob([readFile(uri)], { type })

export const getBlobUrl = (uri, type = '') => URL.createObjectURL(getBlob(uri, type))

export const chmod = () => {
  throw new Error('[memfs] chmod not implemented')
}

export const copy = (oldUri, newUri) => writeFile(newUri, readFile(oldUri))

export const rename = (oldUri, newUri) => {
  const oldPath = getPath(oldUri)
  const newPath = getPath(newUri)
  const dirent = getDirent(oldPath)
  if (!dirent) {
    throw new FileNotFoundError(oldPath)
  }
  if (dirent.type === DirentType.File) {
    copy(oldPath, newPath)
    remove(oldPath)
    return
  }
  for (const [key, value] of Object.entries({ ...files })) {
    if (key === `${oldPath}/` || key.startsWith(`${oldPath}/`)) {
      files[key.replace(oldPath, newPath)] = value
    }
  }
  remove(oldPath)
}

export const stat = (uri) => {
  const dirent = getDirent(uri)
  return dirent ? { exists: true, type: dirent.type } : { exists: false, size: 0 }
}

export const getFiles = () => files
