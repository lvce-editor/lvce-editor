import * as IconTheme from '../IconTheme/IconTheme.js'
import * as SortExplorerItems from '../SortExplorerItems/SortExplorerItems.js'

// TODO use posInSet and setSize properties to compute more effectively
/**
 * @internal
 */
export const computeExplorerRenamedDirent = (dirents, index, newName) => {
  let startIndex = index
  let innerEndIndex = index + 1
  let insertIndex = -1
  let posInSet = -1
  const oldDirent = dirents[index]
  const newDirent = {
    ...oldDirent,
    name: newName,
    path: oldDirent.path.slice(0, -oldDirent.name.length) + newName,
    icon: IconTheme.getFileIcon({ name: newName }),
  }
  const depth = newDirent.depth
  // TODO
  for (; startIndex >= 0; startIndex--) {
    const dirent = dirents[startIndex]
    if (dirent.depth > depth) {
      continue
    }
    if (dirent.depth < depth) {
      break
    }
    if (SortExplorerItems.compareDirent(dirent, newDirent) === 1) {
      insertIndex = startIndex
      posInSet = dirent.posInSet
      // dirent.posInSet++
    } else {
    }
  }
  startIndex++
  for (; innerEndIndex < dirents.length; innerEndIndex++) {
    const dirent = dirents[innerEndIndex]
    if (dirent.depth <= depth) {
      break
    }
    dirent.path = newDirent.path + dirent.path.slice(oldDirent.path.length)
  }
  innerEndIndex--

  let endIndex = innerEndIndex + 1

  for (; endIndex < dirents.length; endIndex++) {
    const dirent = dirents[endIndex]
    if (dirent.depth > depth) {
      continue
    }
    if (dirent.depth < depth) {
      break
    }
    if (insertIndex === -1 && SortExplorerItems.compareDirent(dirent, newDirent === -1)) {
      for (; endIndex < dirents.length; endIndex++) {
        // @ts-ignore
        const childDirent = dirents[endIndex]
      }
      insertIndex = endIndex
      posInSet = dirent.posInSet + 1
    }
  }
  endIndex--

  for (let j = startIndex; j < index; j++) {
    const dirent = dirents[j]
    if (dirent.depth === depth) {
      dirent.posInSet++
    }
  }
  for (let j = index; j < endIndex; j++) {
    const dirent = dirents[j]
    if (dirent.depth === depth) {
      dirent.posInSet--
    }
  }

  // for (let j = startIndex; j < index; j++) {
  //   const dirent = dirents[j]
  //   dirent.posInSet++
  // }

  if (insertIndex === -1) {
    insertIndex = index
    return {
      focusedIndex: index,
      newDirents: [...dirents.slice(0, index), newDirent, ...dirents.slice(index + 1)],
    }
  }
  newDirent.posInSet = posInSet

  const newDirents = [...dirents]
  if (index < insertIndex) {
    insertIndex--
  }
  newDirents.splice(index, 1)
  newDirents.splice(insertIndex, 0, newDirent)

  return { newDirents, focusedIndex: insertIndex }
}
