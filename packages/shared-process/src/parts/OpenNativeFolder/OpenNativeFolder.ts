import open from 'open'
import { VError } from '../VError/VError.ts'

export const openFolder = async (path: any): Promise<any> => {
  try {
    await open(path)
  } catch (error) {
    throw new VError(error, `Failed to open ${path}`)
  }
}
