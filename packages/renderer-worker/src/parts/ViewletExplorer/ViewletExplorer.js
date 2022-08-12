import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js' // TODO should not import viewlet manager -> avoid cyclic dependency
import * as Workspace from '../Workspace/Workspace.js'
// TODO viewlet should only have create and refresh functions
// every thing else can be in a separate module <viewlet>.lazy.js
// and  <viewlet>.ipc.js

// viewlet: creating | refreshing | done | disposed
// TODO recycle viewlets (maybe)

const ITEM_HEIGHT = 22 // TODO handle zoom

export const name = 'Explorer'

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

const priorityMapFoldersFirst = {
  folder: 1,
  directory: 1,
  file: 0,
  unknown: 0,
  socket: 0,
}

const compareDirentType = (direntA, direntB) => {
  return (
    priorityMapFoldersFirst[direntB.type] -
    priorityMapFoldersFirst[direntA.type]
  )
}

const compareDirentName = (direntA, direntB) => {
  return direntA.name.localeCompare(direntB.name)
}

const compareDirent = (direntA, direntB) => {
  return (
    compareDirentType(direntA, direntB) || compareDirentName(direntA, direntB)
  )
}

const toDisplayDirents = (root, pathSeparator, rawDirents, parentDirent) => {
  rawDirents.sort(compareDirent) // TODO maybe shouldn't mutate input argument, maybe sort after mapping
  // TODO figure out whether this uses too much memory (name,path -> redundant, depth could be computed on demand)
  const toDisplayDirent = (rawDirent, index) => {
    const path = parentDirent.path
      ? [parentDirent.path, rawDirent.name].join(pathSeparator)
      : [root, rawDirent.name].join(pathSeparator)
    return {
      name: rawDirent.name,
      posInSet: index + 1,
      setSize: rawDirents.length,
      depth: parentDirent.depth + 1,
      type: rawDirent.type,
      path, // TODO storing absolute path might be too costly, could also store relative path here
      icon: IconTheme.getIcon(rawDirent),
    }
  }
  return rawDirents.map(toDisplayDirent)
}

const getChildDirents = async (root, pathSeparator, parentDirent) => {
  Assert.string(root)
  Assert.string(pathSeparator)
  Assert.object(parentDirent)
  // TODO use event/actor based code instead, this is impossible to cancel right now
  // also cancel updating when opening new folder
  // const dispose = state => state.pendingRequests.forEach(cancelRequest)
  // TODO should use FileSystem directly in this case because it is globally available anyway
  // and more typesafe than Command.execute
  // and more performant
  const uri = parentDirent.path
  const rawDirents = await FileSystem.readDirWithFileTypes(uri)
  const displayDirents = toDisplayDirents(
    root,
    pathSeparator,
    rawDirents,
    parentDirent
  )
  return displayDirents
}

// TODO instead of root string, there should be a root dirent

export const create = (id, uri, left, top, width, height) => {
  return {
    root: '',
    dirents: [],
    focusedIndex: -1,
    focused: false,
    hoverIndex: -1,
    top,
    left,
    height,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 0,
    pathSeparator: '',
    version: 0,
    editingIndex: -1,
  }
}

const getPathSeparator = (root) => {
  return FileSystem.getPathSeparator(root)
}

export const loadContent = async (state) => {
  const root = Workspace.state.workspacePath
  const pathSeparator = await getPathSeparator(root) // TODO only load path separator once
  const dirents = await getTopLevelDirents(root, pathSeparator)
  return {
    ...state,
    root,
    dirents,
    maxLineY: Math.round(state.height / ITEM_HEIGHT),
    pathSeparator,
  }
}

const updateIcon = (dirent) => {
  return { ...dirent, icon: IconTheme.getIcon(dirent) }
}

export const updateIcons = (state) => {
  const newDirents = state.dirents.map(updateIcon)
  return {
    ...state,
    dirents: newDirents,
  }
}

export const contentLoaded = async (state) => {
  // console.trace({ state })
  // TODO execute command directly
  // TODO this should a promise and be awaited
}

const getTopLevelDirents = (root, pathSeparator) => {
  if (!root) {
    return []
  }
  return getChildDirents(root, pathSeparator, {
    depth: 0,
    path: root,
    type: 'directory',
  })
}

// export const contentLoadedEffects = (state) => {
//   // TODO why is this event emitted?
//   GlobalEventBus.emitEvent('dirents.update', state.dirents)

//   // TODO create should not have side effects
//   // TODO dispose listener when explorer is disposed
//   // TODO hoist function
//   const handleLanguagesChanged = () => {
//     const state = Viewlet.getState('Explorer')
//     const newState = updateIcons(state)
//     Viewlet.setState('Explorer', newState)
//   }
//   GlobalEventBus.addListener('languages.changed', handleLanguagesChanged)

//   // TODO hoist function
//   GlobalEventBus.addListener('workspace.change', async () => {
//     const newRoot = Workspace.state.workspacePath
//     const state1 = { ...state, root: newRoot }
//     const newState = await loadContent(state1)
//     await Viewlet.setState('Explorer', newState)
//     // await contentLoaded(newState)
//     // TODO
//   })

//   GlobalEventBus.addListener('iconTheme.change', async () => {
//     await contentLoaded(state)
//   })
// }

export const handleLanguagesChanged = (state) => {
  return updateIcons(state)
}

export const handleWorkspaceChange = async (state) => {
  const newRoot = Workspace.state.workspacePath
  const state1 = { ...state, root: newRoot }
  const newState = await loadContent(state1)
  return newState
}

export const handleIconThemeChange = (state) => {
  return updateIcons(state)
}

const getVisible = (state) => {
  return state.dirents.slice(state.minLineY, state.maxLineY)
}

export const setDeltaY = (state, deltaY) => {
  if (deltaY < 0) {
    deltaY = 0
  } else if (deltaY > state.dirents.length * ITEM_HEIGHT - state.height) {
    deltaY = Math.max(state.dirents.length * ITEM_HEIGHT - state.height, 0)
  }
  if (state.deltaY === deltaY) {
    return state
  }
  const minLineY = Math.round(deltaY / ITEM_HEIGHT)
  const maxLineY = minLineY + Math.round(state.height / ITEM_HEIGHT)
  return {
    ...state,
    deltaY,
    minLineY,
    maxLineY,
  }
}

export const handleWheel = (state, deltaY) => {
  return setDeltaY(state, state.deltaY + deltaY)
}

export const handleContextMenu = async (state, x, y, index) => {
  state.focusedIndex = index
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ 'explorer'
  )
  return state
}

export const getFocusedDirent = (state) => {
  const dirent = state.dirents[state.focusedIndex]
  return dirent
}

// TODO support multiselection and removing multiple dirents
export const removeDirent = async (state) => {
  if (state.focusedIndex < 0) {
    return state
  }
  const dirent = getFocusedDirent(state)
  const absolutePath = dirent.path
  try {
    // TODO handle error
    await FileSystem.remove(absolutePath)
  } catch (error) {
    // TODO vscode shows error as alert (no stacktrace) and retry button
    // maybe should show alert as well, but where to put stacktrace?
    // on web should probably show notification (dialog)
    // ErrorHandling.handleError(error)
    await ErrorHandling.showErrorDialog(error)
    return
  }
  // TODO avoid state mutation
  const newVersion = ++state.version
  // TODO race condition
  // const newState = await loadContent(state)
  if (state.version !== newVersion || state.disposed) {
    return state
  }
  // TODO is it possible to make this more functional instead of mutating state?
  // maybe every function returns a new state?
  const index = state.dirents.indexOf(dirent)
  let deleteEnd = index + 1

  for (; deleteEnd < state.dirents.length; deleteEnd++) {
    if (state.dirents[deleteEnd].depth <= dirent.depth) {
      break
    }
  }
  const deleteCount = deleteEnd - index
  const newDirents = [...state.dirents]
  newDirents.splice(index, deleteCount)
  let indexToFocus = -1

  if (newDirents.length === 0) {
    indexToFocus = -1
  } else if (index < state.focusedIndex) {
    indexToFocus = state.focusedIndex - 1
  } else if (index === state.focusedIndex) {
    indexToFocus = Math.max(state.focusedIndex - 1, 0)
  } else {
    indexToFocus = Math.max(state.focusedIndex - 1, 0)
  }
  return {
    ...state,
    dirents: newDirents,
    focusedIndex: indexToFocus,
  }
}

const updateDirents = async (state) => {
  const newVersion = ++state.version
  const newState = await loadContent(state)
  if (state.version !== newVersion || state.disposed) {
    return
  }
  Object.assign(state, newState)
  await contentLoaded(state)
}

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

export const copyRelativePath = async (state) => {
  const dirent = getFocusedDirent(state)
  const relativePath = dirent.path.slice(1)
  // TODO handle error
  await Command.execute(/* ClipBoard.writeText */ 241, /* text */ relativePath)
}

export const copyPath = async (state) => {
  const dirent = getFocusedDirent(state)
  // TODO windows paths
  // TODO handle error
  const path = dirent.path
  await Command.execute(/* ClipBoard.writeText */ 241, /* text */ path)
}

export const openContainingFolder = async (state) => {
  await Command.execute('Open.openNativeFolder', /* path */ state.root)
  return state
}

const newDirent = async (state) => {
  // TODO do it like vscode, select position between folders and files
  const focusedIndex = state.focusedIndex
  const index = state.focusedIndex + 1
  if (focusedIndex >= 0) {
    const dirent = state.dirents[state.focusedIndex]
    if (dirent.type === 'directory') {
      // TODO handle error
      await handleClickDirectory(state, dirent, focusIndex)
    }
  }
  state.editingIndex = index
  await RendererProcess.invoke(
    /* Viewlet.invoke */ 'Viewlet.send',
    /* id */ 'Explorer',
    /* method */ 'showCreateFileInputBox',
    /* index */ index
  )
  return state
}

// TODO much shared logic with newFolder
export const newFile = async (state) => {
  return newDirent(state)
}

const cancelDirent = async (state) => {
  const index = state.editingIndex
  state.editingIndex = -1
  await RendererProcess.invoke(
    /* Viewlet.invoke */ 'Viewlet.send',
    /* id */ 'Explorer',
    /* method */ 'hideCreateFileInputBox',
    /* index */ index
  )
  return state
}

export const cancelNewFile = async (state) => {
  return cancelDirent()
}

const getParentFolder = (dirents, index, root) => {
  if (index < 0) {
    return root
  }
  return dirents[index].path
}

const acceptDirent = async (state, type) => {
  const editingIndex = state.editingIndex
  const focusedIndex = state.focusedIndex
  state.editingIndex = -1
  const newFileName = await RendererProcess.invoke(
    /* Viewlet.invoke */ 'Viewlet.send',
    /* id */ 'Explorer',
    /* method */ 'hideCreateFileInputBox',
    /* index */ editingIndex
  )
  if (!newFileName) {
    // TODO show error message that file name must not be empty
    // below input box
    await ErrorHandling.showErrorDialog(
      new Error('file name must not be empty')
    )
    return state
  }
  const parentFolder = getParentFolder(state.dirents, focusedIndex, state.root)
  const absolutePath = [parentFolder, newFileName].join(state.pathSeparator)
  // TODO better handle error
  try {
    switch (type) {
      case 'file':
        await FileSystem.writeFile(absolutePath, '')
        break
      case 'folder':
      case 'directory':
        await FileSystem.mkdir(absolutePath)
        break
      default:
        break
    }
  } catch (error) {
    await ErrorHandling.showErrorDialog(error)
    return
  }
  const parentDirent =
    focusedIndex >= 0
      ? state.dirents[focusedIndex]
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
    type,
    icon: '',
  }
  newDirent.icon = IconTheme.getIcon(newDirent)
  let insertIndex = state.focusedIndex
  let deltaPosInSet = 0
  let posInSet = 1
  let setSize = 1
  let i = Math.max(state.focusedIndex, -1) + 1
  for (; i < state.dirents.length; i++) {
    const dirent = state.dirents[i]
    if (dirent.depth !== depth) {
      break
    }
    const compareResult = compareDirent(dirent, newDirent)
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
  state.dirents.splice(insertIndex + 1, 0, newDirent)

  const newDirents = [...state.dirents]
  return {
    ...state,
    dirents: newDirents,
  }
}

// TODO much duplicate logic with acceptNewFolder
export const acceptNewFile = (state) => {
  return acceptDirent(state, 'file')
}

export const acceptNewFolder = (state) => {
  return acceptDirent(state, 'directory')
}

// TODO much copy paste with newFIle command
export const newFolder = async (state) => {
  return newDirent(state)
}

const handleClickFile = async (state, dirent, index) => {
  await Command.execute(
    /* Main.openAbsolutePath */ 'Main.openUri',
    /* absolutePath */ dirent.path
  )
  return {
    ...state,
    focusedIndex: index,
  }
}

const handleClickDirectory = async (state, dirent, index) => {
  dirent.type = 'directory-expanding'
  // TODO handle error
  const dirents = await getChildDirents(state.root, state.pathSeparator, dirent)
  const state2 = Viewlet.getState('Explorer')
  if (!state2) {
    return state
  }
  // TODO use Viewlet.getState here and check if it exists
  const newIndex = state2.dirents.indexOf(dirent)
  // TODO if viewlet is disposed or root has changed, return
  if (newIndex === -1) {
    return state
  }
  // console.log(state.dirents[index] === dirent)
  const newDirents = [...state2.dirents]
  newDirents.splice(newIndex + 1, 0, ...dirents)
  dirent.type = 'directory-expanded'
  dirent.icon = IconTheme.getIcon(dirent)
  // TODO when focused index has changed while expanding, don't update it
  return {
    ...state,
    dirents: newDirents,
    focusedIndex: newIndex,
  }
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

export const handleClick = async (state, index) => {
  if (index === -1) {
    return focusIndex(state, -1)
  }
  const actualIndex = index + state.minLineY
  const dirent = state.dirents[actualIndex]
  if (!dirent) {
    console.warn(`[explorer] dirent at index ${actualIndex} not found`, state)
    return state
  }
  // TODO dirent type should be numeric
  switch (dirent.type) {
    case 'file':
      return handleClickFile(state, dirent, actualIndex)
    // TODO decide on one name
    case 'folder':
    case 'directory':
      return handleClickDirectory(state, dirent, actualIndex)
    case 'directory-expanding':
      return handleClickDirectoryExpanding(state, dirent, actualIndex)
    case 'directory-expanded':
      return handleClickDirectoryExpanded(state, dirent, actualIndex)
    default:
      break
  }
}

export const focusNone = (state) => {
  return focusIndex(state, -1)
}

export const handleClickCurrent = (state) => {
  return handleClick(state, state.focusedIndex)
}

export const focusIndex = (state, index) => {
  return {
    ...state,
    focusedIndex: index,
    focused: true,
  }
}

export const focusNext = (state) => {
  if (state.focusedIndex === state.dirents.length - 1) {
    return state
  }
  return focusIndex(state, state.focusedIndex + 1)
}

export const focusPrevious = (state) => {
  switch (state.focusedIndex) {
    case -1:
      if (state.dirents.length === 0) {
        return state
      }
      return focusIndex(state, state.dirents.length - 1)
    case 0:
      return state
    default:
      return focusIndex(state, state.focusedIndex - 1)
  }
}

export const focusFirst = (state) => {
  if (state.dirents.length === 0 || state.focusedIndex === 0) {
    return state
  }
  return focusIndex(state, 0)
}

export const focusLast = (state) => {
  if (
    state.dirents.length === 0 ||
    state.focusedIndex === state.dirents.length - 1
  ) {
    return state
  }
  return focusIndex(state, state.dirents.length - 1)
}

export const scrollUp = () => {}

export const scrollDown = () => {}
// export const handleBlur=()=>{}

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
        return focusIndex(state, state.focusedIndex + 1)
      }
      break
    default:
      throw new Error(`unsupported file type ${dirent.type}`)
  }
}

const focusParentFolder = (state) => {
  const parentStartIndex = getParentStartIndex(
    state.dirents,
    state.focusedIndex
  )
  if (parentStartIndex === -1) {
    return state
  }
  return focusIndex(state, parentStartIndex)
}

export const handleArrowLeft = (state) => {
  if (state.focusedIndex === -1) {
    return state
  }
  const dirent = state.dirents[state.focusedIndex]
  switch (dirent.type) {
    case 'directory':
    case 'file':
      return focusParentFolder(state)
    case 'directory-expanded':
      return handleClickDirectoryExpanded(state, dirent, state.focusedIndex)
    default:
      // TODO handle expanding directory and cancel file system call to read child dirents
      break
  }
}

export const handleUpload = async (state, dirents) => {
  for (const dirent of dirents) {
    // TODO switch
    // TODO symlink might not be possible to be copied
    // TODO create folder if type is 2
    if (dirent.type === /* File */ 1) {
      // TODO reading text might be inefficient for binary files
      // but not sure how else to send them via jsonrpc
      const content = await dirent.file.text()
      const absolutePath = [state.root, dirent.file.name].join(
        state.pathSeparator
      )
      await FileSystem.writeFile(absolutePath, content)
    }
  }
}

const cancelRequest = (state) => {}

export const dispose = (state) => {
  if (!state.pendingRequests) {
    return
  }
  for (const request of state.pendingRequests) {
    cancelRequest(request)
  }
  state.pendingRequests = []
  // if (state.lastFocusedWidget === context) {
  //   state.lastFocusedWidget = undefined
  // }
}

const IMAGE_EXTENSIONS = new Set([
  '.png',
  '.jpeg',
  '.jpg',
  '.gif',
  '.svg',
  '.ico',
])

const getFileExtension = (file) => {
  return file.slice(file.lastIndexOf('.'))
}

const isImage = (dirent) => {
  // TODO explorer state must be updated when changing folder
  // This is just a workaround
  if (!dirent) {
    return false
  }
  const fileExtension = getFileExtension(dirent.path)
  return IMAGE_EXTENSIONS.has(fileExtension)
}

export const handleMouseEnter = async (state, index) => {
  const dirent = state.dirents[index]
  if (!isImage(dirent)) {
    // TODO preload content maybe when it is a long hover
    return state
  }
  const uri = `${state.root}${dirent.path}`
  const top = state.top + index * ITEM_HEIGHT
  const right = state.left
  await Command.execute(
    /* ImagePreview.show */ 9081,
    /* uri */ uri,
    /* top */ top,
    /* right */ right
  )
}

// TODO what happens when mouse leave and anther mouse enter event occur?
// should update preview instead of closing and reopening

export const handleMouseLeave = async (state) => {
  // await Command.execute(/* ImagePreview.hide */ 9082)
  return state
}

// TODO on windows this would be different
const RE_PATH = /^\/[a-z]+/

const isProbablyPath = (line) => {
  return RE_PATH.test(line)
}

const getBaseName = (path, pathSeparator) => {
  return path.slice(path.lastIndexOf(pathSeparator) + 1)
}

export const handleCopy = async (state) => {
  // TODO handle multiple files
  // TODO if not file is selected, what happens?
  const dirent = getFocusedDirent(state)
  if (!dirent) {
    console.info('[ViewletExplorer/handleCopy] no dirent selected')
    return
  }
  const absolutePath = dirent.path
  // TODO handle copy error gracefully
  const files = [absolutePath]
  await Command.execute(
    /* ClipBoard.writeNativeFiles */ 243,
    /* type */ 'copy',
    /* files */ files
  )
}

const handlePasteNone = (state, nativeFiles) => {
  console.info('[ViewletExplorer/handlePaste] no paths detected')
  return state
}

const mergeDirents = (oldDirents, newDirents) => {
  const merged = []
  let oldIndex = 0
  for (const newDirent of newDirents) {
    merged.push(newDirent)
    for (let i = oldIndex; i < oldDirents.length; i++) {
      if (oldDirents[i].path === newDirent.path) {
        // TOOD copy children of old dirent
        oldIndex = i
        break
      }
    }
  }
  return merged
}

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
  const newDirents = mergeDirents(state2.dirents, topLevelDirents)
  const state3 = {
    ...state2,
    dirents: newDirents,
  }
  return state3
}

const handlePasteCopy = async (state, nativeFiles) => {
  // TODO handle pasting files into nested folder
  // TODO handle pasting files into symlink
  // TODO handle pasting files into broken symlink
  // TODO handle pasting files into hardlink
  // TODO what if folder is big and it takes a long time
  for (const source of nativeFiles.files) {
    const target = `${state.root}${state.pathSeparator}${getBaseName(
      source,
      state.pathSeparator
    )}`
    await FileSystem.copy(source, target)
  }
  const stateNow = Viewlet.getState('Explorer')
  if (stateNow.disposed) {
    return
  }
  // TODO only update folder at which level it changed
  return updateRoot()
}

const handlePasteCut = async (state, nativeFiles) => {
  for (const source of nativeFiles.files) {
    const target = `${state.root}${state.pathSeparator}${getBaseName(source)}`
    await FileSystem.rename(source, target)
  }
  return state
}

const NativeFileTypes = {
  None: 'none',
  Copy: 'copy',
  Cut: 'cut',
}

export const handlePaste = async (state) => {
  const nativeFiles = await Command.execute(
    /* ClipBoard.readNativeFiles */ 'ClipBoard.readNativeFiles'
  )
  // TODO detect cut/paste event, not sure if that is possible
  // TODO check that pasted folder is not a parent folder of opened folder
  // TODO support pasting multiple paths
  // TODO what happens when pasting multiple paths, but some of them error?
  // how many error messages should be shown? Should the operation be undone?
  // TODO what if it is a large folder and takes a long time to copy? Should show progress
  // TODO what if there is a permission error? Probably should show a modal to ask for permission
  // TODO if error is EEXISTS, just rename the copy (e.g. file-copy-1.txt, file-copy-2.txt)
  // TODO actual target should be selected folder
  // TODO but what if a file is currently selected? Then maybe the parent folder
  // TODO but will it work if the folder is a symlink?
  // TODO handle error gracefully when copy fails
  switch (nativeFiles.type) {
    case NativeFileTypes.None:
      return handlePasteNone(state, nativeFiles)
    case NativeFileTypes.Copy:
      return handlePasteCopy(state, nativeFiles)
    case NativeFileTypes.Cut:
      return handlePasteCut(state, nativeFiles)
    default:
      throw new Error(`unexpected native paste type: ${nativeFiles.type}`)
  }
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  const maxLineY = state.minLineY + Math.round(dimensions.height / ITEM_HEIGHT)
  return {
    ...state,
    ...dimensions,
    maxLineY,
  }
}

export const expandAll = async (state) => {
  const { dirents, focusedIndex } = state
  if (focusedIndex === -1) {
    return state
  }
  const dirent = dirents[focusedIndex]
  const depth = dirent.depth
  const newDirents = [...dirents]
  // TODO fetch child dirents in parallel
  for (const dirent of newDirents) {
    if (dirent.depth === depth && dirent.type === 'directory') {
      // TODO expand
      // TODO avoid mutating state here
      dirent.type = 'directory-expanding'
      // TODO handle error
      // TODO race condition
      const childDirents = await getChildDirents(
        state.root,
        state.pathSeparator,
        dirent
      )
      const newIndex = newDirents.indexOf(dirent)
      if (newIndex === -1) {
        continue
      }
      newDirents.splice(newIndex + 1, 0, ...childDirents)
      // TODO avoid mutating state here
      dirent.type = 'directory-expanded'
      // await expand(state, dirent.index)
    }
  }
  return {
    ...state,
    dirents: newDirents,
  }
}

const isTopLevel = (dirent) => {
  return dirent.depth === 1
}

const toCollapsedDirent = (dirent) => {
  if (dirent.type === 'directory-expanded') {
    return {
      ...dirent,
      type: 'directory',
    }
  }
  return dirent
}

export const collapseAll = (state) => {
  const newDirents = state.dirents.filter(isTopLevel).map(toCollapsedDirent)
  return {
    ...state,
    dirents: newDirents,
  }
}

export const handleBlur = (state) => {
  // TODO when blur event occurs because of context menu, focused index should stay the same
  // but focus outline should be removed
  return {
    ...state,
    focused: false,
  }
}

const getIndex = (dirents, uri) => {
  for (let i = 0; i < dirents.length; i++) {
    const dirent = dirents[i]
    if (dirent.path === uri) {
      return i
    }
  }
  return -1
}

const getPathParts = (root, uri, pathSeparator) => {
  const parts = []
  let index = root.length - 1
  let depth = 0
  while ((index = uri.indexOf('/', index + 1)) !== -1) {
    console.log({ index, uri, root })
    const partUri = uri.slice(0, index)
    parts.push({ path: partUri, depth: depth++, root, pathSeparator })
  }
  return parts
}

const getPathPartsToReveal = (root, pathParts, dirents) => {
  for (let i = 0; i < pathParts.length; i++) {
    const pathPart = pathParts[i]
    const index = getIndex(dirents, pathPart.uri)
    if (index === -1) {
      continue
    }
    return pathParts.slice(i)
  }
  return pathParts
}

const getPathPartChildren = (pathPart) => {
  const children = getChildDirents(
    pathPart.root,
    pathPart.pathSeparator,
    pathPart
  )
  return children
}

// TODO maybe just insert items into explorer and refresh whole explorer
const revealItemHidden = async (state, uri) => {
  const { root, pathSeparator, dirents } = state
  const pathParts = getPathParts(root, uri, pathSeparator)
  const pathPartsToReveal = getPathPartsToReveal(root, pathParts, dirents)
  const pathPartsChildren = await Promise.all(
    pathPartsToReveal.map(getPathPartChildren)
  )
  const pathPartsChildrenFlat = pathPartsChildren.flat(1)
  const mergedDirents = [...dirents, ...pathPartsChildrenFlat]
  const index = getIndex(mergedDirents, uri)
  return {
    ...state,
    dirents: mergedDirents,
    focused: true,
    focusedIndex: index,
  }
}

const revealItemVisible = (state, index) => {
  return {
    ...state,
    focused: true,
    focusedIndex: index,
  }
}

export const revealItem = async (state, uri) => {
  Assert.object(state)
  Assert.string(uri)
  const dirents = state.dirents
  const index = getIndex(dirents, uri)
  if (index === -1) {
    return revealItemHidden(state, uri)
  }
  return revealItemVisible(state, index)
}

export const shouldApplyNewState = (newState, fn) => {
  if (newState.root !== Workspace.state.workspacePath) {
    console.log(
      'root does not match',
      `${newState.root} !== ${Workspace.state.workspacePath}`
    )
    return false
  }
  return true
}

export const events = {
  'languages.changed': handleLanguagesChanged,
  'workspace.change': handleWorkspaceChange,
  'iconTheme.change': handleIconThemeChange,
}

export const hasFunctionalRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.dirents === newState.dirents &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY
    )
  },
  apply(oldState, newState) {
    const visibleDirents = getVisible(newState)
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Explorer',
      /* method */ 'updateDirents',
      /* visibleDirents */ visibleDirents,
    ]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return (
      oldState.focusedIndex === newState.focusedIndex &&
      oldState.focused === newState.focused &&
      // TODO rendering dirents should not override focus
      // when that issue is fixed, this can be removed
      oldState.dirents === newState.dirents &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY
    )
  },
  apply(oldState, newState) {
    const oldFocusedIndex = oldState.focused ? oldState.focusedIndex : -2
    const newFocusedIndex = newState.focused ? newState.focusedIndex : -2
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Explorer',
      /* method */ 'setFocusedIndex',
      /* oldindex */ oldFocusedIndex,
      /* newIndex */ newFocusedIndex,
    ]
  },
}

export const render = [renderItems, renderFocusedIndex]
