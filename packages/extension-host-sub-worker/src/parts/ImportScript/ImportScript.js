import { VError } from '../VError/VError.js'
import * as CleanImportError from '../CleanImportError/CleanImportError.js'

export const importScript = async (path) => {
  try {
    const module = await import(path)
    return module
  } catch (error) {
    const cleanError = CleanImportError.cleanImportError(error)
    throw new VError(cleanError, `Failed to load ${path}`)
  }
}
