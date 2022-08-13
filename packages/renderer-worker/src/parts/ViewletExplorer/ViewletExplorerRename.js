import * as FileSystem from '../FileSystem/FileSystem.js'

export const renameDirent = async (state) => {
  const index = state.focusedIndex
  state.editingIndex = index
  const dirent = state.dirents[index]
  const name = dirent.name
  await RendererProcess.invoke(
    /* Viewlet.invoke */ 'Viewlet.send',
    /* id */ 'Explorer',
    /* method */ 'showRenameInputBox',
    /* index */ index,
    /* name */ name
  )
}

export const cancelRename = async (state) => {
  const index = state.editingIndex
  const dirent = state.dirents[index]
  state.editingIndex = -1
  await RendererProcess.invoke(
    /* Viewlet.invoke */ 'Viewlet.send',
    /* id */ 'Explorer',
    /* method */ 'hideRenameBox',
    /* index */ index,
    /* dirent */ dirent
  )
}

// TODO use posInSet and setSize properties to compute more effectively
/**
 * @internal
 */
export const computeRenamedDirent = (dirents, index, newName) => {
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
    if (compareDirent(dirent, newDirent) === 1) {
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
    if (insertIndex === -1 && compareDirent(dirent, newDirent === -1)) {
      for (; endIndex < dirents.length; endIndex++) {
        const childDirent = dirents[endIndex]
      }
      insertIndex = endIndex
      posInSet = dirent.posInSet + 1
    }
  }
  endIndex--
  // console.log({endi /})

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
      newDirents: [
        ...dirents.slice(0, index),
        newDirent,
        ...dirents.slice(index + 1),
      ],
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
  const index = state.editingIndex
  state.editingIndex = -1
  const renamedDirent = state.dirents[index]
  const newDirentName = await RendererProcess.invoke(
    /* Viewlet.invoke */ 'Viewlet.send',
    /* id */ 'Explorer',
    /* method */ 'hideRenameBox',
    /* index */ index,
    /* dirent */ renamedDirent
  )
  try {
    // TODO this does not work with rename of nested file
    const oldAbsolutePath = renamedDirent.path
    const newAbsolutePath = [state.root, newDirentName].join(
      state.pathSeparator
    )
    await FileSystem.rename(oldAbsolutePath, newAbsolutePath)
  } catch (error) {
    await ErrorHandling.showErrorDialog(error)
    return
  }
  const { dirents } = state
  const { newDirents, focusedIndex } = computeRenamedDirent(
    dirents,
    index,
    newDirentName
  )
  //  TODO move focused index
  state.dirents = newDirents
  await contentLoaded(state)
  await focusIndex(state, focusedIndex)

  // await updateDirents(state)
}
