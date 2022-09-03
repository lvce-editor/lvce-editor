import open from 'open'
import VError from 'verror'

export const openFolder = async (path) => {
  try {
    await open(path)
  } catch (error) {
    throw new VError(error, `Failed to open ${path}`)
  }
}
