import * as DirentType from '../DirentType/DirentType.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Path from '../Path/Path.js'
import * as SortExplorerItems from '../SortExplorerItems/SortExplorerItems.js'

export const renameDirent = (state) => {
  const { focusedIndex, items } = state
  const item = items[focusedIndex]
  return {
    ...state,
    editingIndex: focusedIndex,
    editingType: ExplorerEditingType.Rename,
    editingValue: item.name,
  }
}

const getParentFolder = (dirents, index, root) => {
  if (index < 0) {
    return root
  }
  return dirents[index].path
}

const acceptCreate = async (state) => {
  const { editingIndex, focusedIndex, editingValue, editingType } = state
  const newFileName = editingValue
  if (!newFileName) {
    // TODO show error message that file name must not be empty
    // below input box
    await ErrorHandling.showErrorDialog(new Error('file name must not be empty'))
    return state
  }
  const parentFolder = getParentFolder(state.items, focusedIndex, state.root)
  const absolutePath = [parentFolder, newFileName].join(state.pathSeparator)
  // TODO better handle error
  try {
    switch (editingType) {
      case ExplorerEditingType.CreateFile:
        await FileSystem.createFile(absolutePath)
        break
      case ExplorerEditingType.CreateFolder:
        await FileSystem.mkdir(absolutePath)
        break
      default:
        break
    }
  } catch (error) {
    await ErrorHandling.showErrorDialog(error)
    return state
  }
  const parentDirent =
    focusedIndex >= 0
      ? state.items[focusedIndex]
      : {
          depth: 0,
          path: state.root,
        }
  const depth = parentDirent.depth + 1
  const newDirent = {
    path: absolutePath,
    posInSet: -1,
    setSize: 1,
    depth,
    name: newFileName,
    type: editingType === ExplorerEditingType.CreateFile ? DirentType.File : DirentType.Directory,
    icon: '',
  }
  newDirent.icon = IconTheme.getIcon(newDirent)
  let insertIndex = state.focusedIndex
  let deltaPosInSet = 0
  let posInSet = 1
  let setSize = 1
  let i = Math.max(state.focusedIndex, -1) + 1
  for (; i < state.items.length; i++) {
    const dirent = state.items[i]
    if (dirent.depth !== depth) {
      break
    }
    const compareResult = SortExplorerItems.compareDirent(dirent, newDirent)
    if (compareResult === 1) {
      insertIndex = i
      deltaPosInSet = 1
    } else {
      posInSet = dirent.posInSet + 1
      setSize = dirent.setSize + 1
      insertIndex = i
    }
    dirent.setSize++
    dirent.posInSet += deltaPosInSet
  }
  newDirent.setSize = setSize
  newDirent.posInSet = posInSet
  state.items.splice(insertIndex + 1, 0, newDirent)

  const newDirents = [...state.items]
  return {
    ...state,
    items: newDirents,
    editingIndex: -1,
    focusedIndex: editingIndex,
  }
}

// TODO use posInSet and setSize properties to compute more effectively
/**
 * @internal
 */
const computeRenamedDirent = (dirents, index, newName) => {
  let startIndex = index
  let innerEndIndex = index + 1
  let insertIndex = -1
  let posInSet = -1
  const oldDirent = dirents[index]
  const newDirent = {
    ...oldDirent,
    name: newName,
    path: oldDirent.path.slice(0, -oldDirent.name.length) + newName,
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

export const acceptRename = async (state) => {
  const { editingIndex, editingValue, items, pathSeparator } = state
  const renamedDirent = items[editingIndex]
  try {
    // TODO this does not work with rename of nested file
    const oldAbsolutePath = renamedDirent.path
    const oldParentPath = Path.dirname(pathSeparator, oldAbsolutePath)
    const newAbsolutePath = [oldParentPath, editingValue].join(pathSeparator)
    await FileSystem.rename(oldAbsolutePath, newAbsolutePath)
  } catch (error) {
    await ErrorHandling.showErrorDialog(error)
    return state
  }
  const { newDirents, focusedIndex } = computeRenamedDirent(items, editingIndex, editingValue)
  //  TODO move focused index
  state.items = newDirents
  return {
    ...state,
    editingIndex: -1,
    editingValue: '',
    focusedIndex,
    focused: true,
  }
}

export const acceptEdit = (state) => {
  const { editingType } = state
  switch (editingType) {
    case ExplorerEditingType.CreateFile:
      return acceptCreate(state)
    case ExplorerEditingType.Rename:
      return acceptRename(state)
    default:
      return state
  }
}
