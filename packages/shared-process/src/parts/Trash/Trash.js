import { default as _trash } from 'trash'
import { VError } from '../VError/VError.js'

export const trash = async (path) => {
  try {
    await _trash(path)
  } catch (error) {
    throw new VError(error, 'Failed to move item to trash')
  }
}
