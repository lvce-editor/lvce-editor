import * as ImportScript from '../ImportScript/ImportScript.ts'
import { VError } from '../VError/VError.ts'

export const importTest = async (url: string) => {
  try {
    return await ImportScript.importScript(url)
  } catch (error) {
    throw new VError(error, 'Failed to import test')
  }
}
