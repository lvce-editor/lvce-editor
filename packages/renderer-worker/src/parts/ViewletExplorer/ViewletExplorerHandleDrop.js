import { VError } from '../VError/VError.js'
import { handleDropIndex } from './ViewletExplorerHandleDropIndex.js'
import { handleDropRoot } from './ViewletExplorerHandleDropRoot.js'
import { getIndexFromPosition } from './ViewletExplorerShared.js'

export const handleDrop = async (state, x, y, files) => {
  try {
    const index = getIndexFromPosition(state, x, y)
    switch (index) {
      case -1:
        return await handleDropRoot(state, files)
      default:
        return await handleDropIndex(state, index, files)
    }
  } catch (error) {
    throw new VError(error, `Failed to drop files`)
  }
}
