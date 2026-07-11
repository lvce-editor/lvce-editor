import { pathToFileURL } from 'node:url'
import * as CleanImportError from '../CleanImportError/CleanImportError.js'
import { VError } from '../VError/VError.js'

const windowsPathRegex = /^\/[A-Za-z]:\//

export const normalizePath = (path, platform = process.platform) => {
  return platform === 'win32' && windowsPathRegex.test(path) ? path.slice(1) : path
}

export const importScript = async (path) => {
  try {
    const normalizedPath = normalizePath(path)
    const url = pathToFileURL(normalizedPath).toString()
    const module = await import(url)
    return module
  } catch (error) {
    const cleanError = CleanImportError.cleanImportError(error)
    throw new VError(cleanError, `Failed to load ${path}`)
  }
}
