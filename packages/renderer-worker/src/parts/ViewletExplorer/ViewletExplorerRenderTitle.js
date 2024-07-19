import * as ExplorerStrings from '../ViewletExplorer/ViewletExplorerStrings.js'

const getPostFix = (root) => {
  if (!root) {
    return ExplorerStrings.noFolderOpen()
  }
  return ''
}

export const renderTitle = {
  isEqual(oldState, newState) {
    return oldState.root === newState.root
  },
  apply(oldState, newState) {
    const postFix = getPostFix(newState.root)
    const prefix = 'Explorer'
    const title = postFix ? `${prefix}: ${postFix}` : prefix
    return title
  },
}
