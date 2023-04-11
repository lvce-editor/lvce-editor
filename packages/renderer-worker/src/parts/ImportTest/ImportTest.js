import * as ImportScript from '../ImportScript/ImportScript.js'
import { VError } from '../VError/VError.js'

export const importTest = async (url) => {
  try {
    return await ImportScript.importScript(url)
  } catch (error) {
    throw new VError(error, `Failed to import test`)
  }
}
