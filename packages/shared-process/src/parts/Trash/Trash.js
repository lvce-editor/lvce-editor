import { VError } from '../VError/VError.js'

export const trash = async (path) => {
  try {
    const { default: _trash } = await import('trash')
    await _trash(path)
  } catch (error) {
    throw new VError(error, 'Failed to move item to trash')
  }
}
