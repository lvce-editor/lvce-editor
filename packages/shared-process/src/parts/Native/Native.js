import open from 'open'
import * as Error from '../Error/Error.js'

export const openFolder = async (path) => {
  try {
    await open(path)
  } catch (error) {
    throw new Error.OperationalError({
      cause: error,
      code: 'E_OPEN_SYSTEM_ERROR',
      message: `Failed to open ${path}`,
    })
  }
}
