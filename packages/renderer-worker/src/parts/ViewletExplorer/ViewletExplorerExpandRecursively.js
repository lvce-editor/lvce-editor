import * as DirentType from '../DirentType/DirentType.js'
import { getChildDirents, getParentEndIndex } from './ViewletExplorerShared.js'

const makeExpanded = (dirent) => {
  if (dirent.type === DirentType.Directory) {
    return {
      ...dirent,
      type: DirentType.DirectoryExpanded,
    }
  }
  return dirent
}

export const expandRecursively = async (state) => {
  const { items, focusedIndex, pathSeparator, root } = state
  const dirent =
    focusedIndex < 0
      ? {
          type: DirentType.Directory,
          path: root,
          depth: 0,
        }
      : items[focusedIndex]
  if (
    dirent.type !== DirentType.Directory &&
    dirent.type !== DirentType.DirectoryExpanding
  ) {
    return state
  }
  // TODO this is very inefficient
  const getChildDirentsRecursively = async (dirent) => {
    switch (dirent.type) {
      case DirentType.File:
        return [dirent]
      case DirentType.Directory:
        const childDirents = await getChildDirents(root, pathSeparator, dirent)
        const all = [makeExpanded(dirent)]
        for (const childDirent of childDirents) {
          const childAll = await getChildDirentsRecursively(childDirent)
          all.push(...childAll)
        }
        return all
      default:
        return []
    }
  }
  // TODO race condition: what if folder is being collapse while it is recursively expanding?
  // TODO race condition: what if folder is being deleted while it is recursively expanding?
  // TODO race condition: what if a new file/folder is created while the folder is recursively expanding?
  const childDirents = await getChildDirentsRecursively(dirent)
  const startIndex = focusedIndex
  if (focusedIndex >= 0) {
    const endIndex = getParentEndIndex(items, focusedIndex)
    const newDirents = [
      ...items.slice(0, startIndex),
      ...childDirents,
      ...items.slice(endIndex),
    ]
    return { ...state, items: newDirents }
  }
  return {
    ...state,
    items: childDirents.slice(1),
  }
}
