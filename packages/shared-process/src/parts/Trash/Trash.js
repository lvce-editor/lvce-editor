import { default as _trash } from 'trash'
import VError from 'verror'

export const trash = async (path) => {
  try {
    await _trash(path)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to move item to trash')
  }
}
