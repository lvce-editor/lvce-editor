import * as path from 'node:path'
import * as Root from '../Root/Root.js'

export const absolute = (relativePath) => {
  if (isAbsolute(relativePath)) {
    return relativePath
  }
  return path.join(Root.root, relativePath)
}

export const isAbsolute = (inputPath) => {
  return path.isAbsolute(inputPath)
}

export const dirname = (dirent) => {
  return path.dirname(dirent)
}

export const join = (...paths) => {
  return path.join(...paths)
}

export const baseName = (dirent) => {
  return path.basename(dirent)
}
