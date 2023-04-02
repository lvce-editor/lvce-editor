import { chmod } from 'node:fs/promises'
import { VError } from '../VError/VError.js'

export const makeExecutable = async (file) => {
  try {
    await chmod(file, 0o755)
  } catch (error) {
    throw new VError(error, `Failed to make file executable`)
  }
}
