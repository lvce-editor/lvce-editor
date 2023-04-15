import open from 'open'
import { VError } from '../VError/VError.js'

export const openFolder = async (path) => {
  try {
    await open(path)
  } catch (error) {
    throw new VError(error, `Failed to open ${path}`)
  }
}
