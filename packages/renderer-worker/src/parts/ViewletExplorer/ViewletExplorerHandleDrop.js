import { handleDropIndex } from './ViewletExplorerHandleDropIndex.js'
import { handleDropRoot } from './ViewletExplorerHandleDropRoot.js'
import { getIndexFromPosition } from './ViewletExplorerShared.js'

export const handleDrop = (state, x, y, files) => {
  const index = getIndexFromPosition(state, x, y)
  switch (index) {
    case -1:
      return handleDropRoot(state, files)
    default:
      return handleDropIndex(state, index, files)
  }
}
