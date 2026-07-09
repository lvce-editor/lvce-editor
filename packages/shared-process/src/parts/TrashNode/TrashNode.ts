import { VError } from '@lvce-editor/verror'
import _trash from 'trash'

export const trash = async (path) => {
  try {
    await _trash(path)
  } catch (error) {
    throw new VError(error, 'Failed to move item to trash')
  }
}
