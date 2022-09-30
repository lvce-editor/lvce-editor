import * as Viewlet from '../Viewlet/Viewlet.js'
import { getTopLevelDirents, mergeDirents } from './ViewletExplorerShared.js'

// TODO add lots of tests for this
export const updateRoot = async () => {
  const state1 = Viewlet.getState('Explorer')
  if (state1.disposed) {
    return state1
  }
  // const file = nativeFiles.files[0]
  const topLevelDirents = await getTopLevelDirents(
    state1.root,
    state1.pathSeparator
  )
  const state2 = Viewlet.getState('Explorer')
  // TODO what if root changes while reading directories?
  if (state2.disposed || state2.root !== state1.root) {
    return state2
  }
  const newDirents = mergeDirents(state2.items, topLevelDirents)
  const state3 = {
    ...state2,
    items: newDirents,
  }
  return state3
}
