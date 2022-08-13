import * as ViewletExplorerFocusIndex from './ViewletExplorerFocusIndex.js'
import * as IconTheme from '../IconTheme/IconTheme.js'

const getParentStartIndex = (dirents, index) => {
  const dirent = dirents[index]
  let startIndex = index - 1
  while (startIndex >= 0 && dirents[startIndex].depth >= dirent.depth) {
    startIndex--
  }
  return startIndex
}

const getParentEndIndex = (dirents, index) => {
  const dirent = dirents[index]
  let endIndex = index + 1
  while (endIndex < dirents.length && dirents[endIndex].depth > dirent.depth) {
    endIndex++
  }
  return endIndex
}

const handleClickDirectoryExpanding = async (state, dirent, index) => {
  dirent.type = 'directory'
  dirent.icon = IconTheme.getIcon(dirent)
  await RendererProcess.invoke(
    /* viewSend */ 'Viewlet.send',
    /* id */ 'Explorer',
    /* method */ 'collapse',
    /* index */ index,
    /* removeCount */ 0
  )
  return state
}

const handleClickDirectoryExpanded = (state, dirent, index) => {
  dirent.type = 'directory'
  dirent.icon = IconTheme.getIcon(dirent)
  const endIndex = getParentEndIndex(state.dirents, index)
  const removeCount = endIndex - index - 1
  // TODO race conditions and side effects are everywhere
  const newDirents = [...state.dirents]
  newDirents.splice(index + 1, removeCount)
  return {
    ...state,
    dirents: newDirents,
  }
}

export const handleArrowRight = async (state) => {
  if (state.focusedIndex === -1) {
    return state
  }
  const dirent = state.dirents[state.focusedIndex]
  switch (dirent.type) {
    case 'file':
      return state
    case 'directory':
      return handleClickDirectory(state, dirent, state.focusedIndex)
    case 'directory-expanded':
      if (state.focusedIndex === state.dirents.length - 1) {
        return state
      }
      const nextDirent = state.dirents[state.focusedIndex + 1]
      if (nextDirent.depth === dirent.depth + 1) {
        return ViewletExplorerFocusIndex.focusIndex(
          state,
          state.focusedIndex + 1
        )
      }
      break
    default:
      throw new Error(`unsupported file type ${dirent.type}`)
  }
}
