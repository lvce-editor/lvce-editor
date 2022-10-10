import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js' // TODO should not import viewlet manager -> avoid cyclic dependency
import * as Workspace from '../Workspace/Workspace.js'
import { focusIndex } from './ViewletExplorerFocusIndex.js'
import {
  compareDirent,
  getChildDirents,
  getIndexFromPosition,
  getParentEndIndex,
  getParentStartIndex,
  getTopLevelDirents,
} from './ViewletExplorerShared.js'
import * as PromiseStatus from '../PromiseStatus/PromiseStatus.js'
// TODO viewlet should only have create and refresh functions
// every thing else can be in a separate module <viewlet>.lazy.js
// and  <viewlet>.ipc.js

// viewlet: creating | refreshing | done | disposed
// TODO recycle viewlets (maybe)

export const name = 'Explorer'

// TODO instead of root string, there should be a root dirent

export const create = (id, uri, left, top, width, height) => {
  return {
    root: '',
    items: [],
    focusedIndex: -1,
    focused: false,
    hoverIndex: -1,
    top,
    left,
    height,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 0,
    pathSeparator: PathSeparatorType.Slash,
    version: 0,
    editingIndex: -1,
    itemHeight: 22,
    dropTargets: [],
  }
}

const getPathSeparator = (root) => {
  return FileSystem.getPathSeparator(root)
}

const isExpandedDirectory = (dirent) => {
  return dirent.type === DirentType.DirectoryExpanded
}

const getPath = (dirent) => {
  return dirent.path
}

const getSavedChildDirents = (map, path, depth) => {
  const children = map[path]
  if (!children) {
    return []
  }
  const dirents = []
  children.sort(compareDirent)
  const childrenLength = children.length
  for (let i = 0; i < childrenLength; i++) {
    const child = children[i]
    const { name, type } = child
    const childPath = path + '/' + name

    if (child.type === DirentType.Directory && childPath in map) {
      dirents.push({
        depth,
        posInSet: i + 1,
        setSize: childrenLength,
        icon: IconTheme.getFolderIcon({ name }),
        name,
        path: childPath,
        type: DirentType.DirectoryExpanded,
      })
      dirents.push(...getSavedChildDirents(map, childPath, depth + 1))
    } else {
      dirents.push({
        depth,
        posInSet: i + 1,
        setSize: childrenLength,
        icon: IconTheme.getIcon({ type, name }),
        name,
        path: childPath,
        type,
      })
    }
  }
  return dirents
}

const createDirents = (root, expandedDirentPaths, expandedDirentChildren) => {
  const dirents = []
  const map = Object.create(null)
  for (let i = 0; i < expandedDirentPaths.length; i++) {
    const path = expandedDirentPaths[i]
    const children = expandedDirentChildren[i]
    if (children.status === PromiseStatus.Fulfilled) {
      map[path] = children.value
    }
  }
  dirents.push(...getSavedChildDirents(map, root, 1))
  return dirents
}

const restoreExpandedState = async (savedState, root, pathSeparator) => {
  // TODO read all opened folders in parallel
  // ignore ENOENT errors
  // ignore ENOTDIR errors
  // merge all dirents
  // restore scroll location
  if (!savedState || !savedState.expandedPaths || savedState.root !== root) {
    return await getTopLevelDirents(root, pathSeparator)
  }
  const expandedDirentPaths = [root, ...savedState.expandedPaths]
  const expandedDirentChildren = await Promise.allSettled(
    expandedDirentPaths.map(FileSystem.readDirWithFileTypes)
  )
  const savedRoot = savedState.root
  const dirents = createDirents(
    savedRoot,
    expandedDirentPaths,
    expandedDirentChildren
  )
  return dirents
}

export const saveState = (state) => {
  const { items, root } = state
  const expandedPaths = items.filter(isExpandedDirectory).map(getPath)
  return {
    expandedPaths,
    root,
  }
}

export const loadContent = async (state, savedState) => {
  const root = state.root || Workspace.state.workspacePath
  console.log({ root })
  // TODO path separator could be restored from saved state
  const pathSeparator = await getPathSeparator(root) // TODO only load path separator once
  const restoredDirents = await restoreExpandedState(
    savedState,
    root,
    pathSeparator
  )
  console.log({ restoredDirents })
  const { itemHeight, height } = state
  return {
    ...state,
    root,
    items: restoredDirents,
    maxLineY: Math.round(height / itemHeight),
    pathSeparator,
  }
}

const updateIcon = (dirent) => {
  return { ...dirent, icon: IconTheme.getIcon(dirent) }
}

export const updateIcons = (state) => {
  const newDirents = state.items.map(updateIcon)
  return {
    ...state,
    items: newDirents,
  }
}

export const contentLoaded = async (state) => {
  // console.trace({ state })
  // TODO execute command directly
  // TODO this should a promise and be awaited
}

// export const contentLoadedEffects = (state) => {
//   // TODO why is this event emitted?
//   GlobalEventBus.emitEvent('dirents.update', state.items)

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
  return state.items.slice(state.minLineY, state.maxLineY)
}

// TODO rename dirents to items, then can use virtual list component directly
export const setDeltaY = (state, deltaY) => {
  const { itemHeight, height, items } = state
  if (deltaY < 0) {
    deltaY = 0
  } else if (deltaY > items.length * itemHeight - height) {
    deltaY = Math.max(items.length * itemHeight - height, 0)
  }
  if (state.deltaY === deltaY) {
    return state
  }
  const minLineY = Math.round(deltaY / itemHeight)
  const maxLineY = minLineY + Math.round(height / itemHeight)
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

export const getFocusedDirent = (state) => {
  const dirent = state.items[state.focusedIndex]
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
  const index = state.items.indexOf(dirent)
  let deleteEnd = index + 1

  for (; deleteEnd < state.items.length; deleteEnd++) {
    if (state.items[deleteEnd].depth <= dirent.depth) {
      break
    }
  }
  const deleteCount = deleteEnd - index
  const newDirents = [...state.items]
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
    items: newDirents,
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
  const dirent = state.items[index]
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
  const dirent = state.items[index]
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
  const renamedDirent = state.items[index]
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
  const { items } = state
  const { newDirents, focusedIndex } = computeRenamedDirent(
    items,
    index,
    newDirentName
  )
  //  TODO move focused index
  state.items = newDirents
  await contentLoaded(state)
  await focusIndex(state, focusedIndex)

  // await updateDirents(state)
}

export const copyRelativePath = async (state) => {
  const dirent = getFocusedDirent(state)
  const relativePath = dirent.path.slice(1)
  // TODO handle error
  await Command.execute(
    /* ClipBoard.writeText */ 'ClipBoard.writeText',
    /* text */ relativePath
  )
  return state
}

export const copyPath = async (state) => {
  const dirent = getFocusedDirent(state)
  // TODO windows paths
  // TODO handle error
  const path = dirent.path
  await Command.execute(
    /* ClipBoard.writeText */ 'ClipBoard.writeText',
    /* text */ path
  )
  return state
}

const getContaingingFolder = (root, dirents, focusedIndex, pathSeparator) => {
  if (focusedIndex < 0) {
    return root
  }
  const dirent = dirents[focusedIndex]
  const direntPath = dirent.path
  const direntParentPath = direntPath.slice(0, -(dirent.name.length + 1))
  const path = `${direntParentPath}`
  return path
}

export const openContainingFolder = async (state) => {
  const { focusedIndex, root, items, pathSeparator } = state
  const path = getContaingingFolder(root, items, focusedIndex, pathSeparator)
  await Command.execute('OpenNativeFolder.openNativeFolder', /* path */ path)
  return state
}

const newDirent = async (state) => {
  // TODO do it like vscode, select position between folders and files
  const focusedIndex = state.focusedIndex
  const index = state.focusedIndex + 1
  if (focusedIndex >= 0) {
    const dirent = state.items[state.focusedIndex]
    if (dirent.type === DirentType.Directory) {
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
  const parentFolder = getParentFolder(state.items, focusedIndex, state.root)
  const absolutePath = [parentFolder, newFileName].join(state.pathSeparator)
  // TODO better handle error
  try {
    switch (type) {
      case DirentType.File:
        await FileSystem.writeFile(absolutePath, '')
        break
      case DirentType.Directory:
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
    type,
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
  state.items.splice(insertIndex + 1, 0, newDirent)

  const newDirents = [...state.items]
  return {
    ...state,
    items: newDirents,
  }
}

// TODO much duplicate logic with acceptNewFolder
export const acceptNewFile = (state) => {
  return acceptDirent(state, DirentType.File)
}

export const acceptNewFolder = (state) => {
  return acceptDirent(state, DirentType.Directory)
}

// TODO much copy paste with newFIle command
export const newFolder = async (state) => {
  return newDirent(state)
}

const handleClickFile = async (state, dirent, index, keepFocus = false) => {
  await Command.execute(
    /* Main.openAbsolutePath */ 'Main.openUri',
    /* absolutePath */ dirent.path,
    /* focus */ !keepFocus
  )
  return {
    ...state,
    focusedIndex: index,
  }
}

const handleClickDirectory = async (state, dirent, index) => {
  dirent.type = DirentType.DirectoryExpanding
  // TODO handle error
  const dirents = await getChildDirents(state.root, state.pathSeparator, dirent)
  const state2 = Viewlet.getState('Explorer')
  if (!state2) {
    return state
  }
  // TODO use Viewlet.getState here and check if it exists
  const newIndex = state2.items.indexOf(dirent)
  // TODO if viewlet is disposed or root has changed, return
  if (newIndex === -1) {
    return state
  }
  // console.log(state.items[index] === dirent)
  const newDirents = [...state2.items]
  newDirents.splice(newIndex + 1, 0, ...dirents)
  dirent.type = DirentType.DirectoryExpanded
  dirent.icon = IconTheme.getIcon(dirent)
  // TODO when focused index has changed while expanding, don't update it
  return {
    ...state,
    items: newDirents,
    focusedIndex: newIndex,
  }
}

const handleClickDirectoryExpanding = async (state, dirent, index) => {
  dirent.type = DirentType.Directory
  dirent.icon = IconTheme.getIcon(dirent)
  return {
    ...state,
    focusedIndex: index,
  }
}

const handleClickDirectoryExpanded = (state, dirent, index) => {
  dirent.type = DirentType.Directory
  dirent.icon = IconTheme.getIcon(dirent)
  const endIndex = getParentEndIndex(state.items, index)
  const removeCount = endIndex - index - 1
  // TODO race conditions and side effects are everywhere
  const newDirents = [...state.items]
  newDirents.splice(index + 1, removeCount)
  return {
    ...state,
    items: newDirents,
    focusedIndex: index,
  }
}

export const handleClick = (state, index, keepFocus = false) => {
  if (index === -1) {
    return focusIndex(state, -1)
  }
  const actualIndex = index + state.minLineY
  const dirent = state.items[actualIndex]
  if (!dirent) {
    console.warn(`[explorer] dirent at index ${actualIndex} not found`, state)
    return state
  }
  // TODO dirent type should be numeric
  switch (dirent.type) {
    case DirentType.File:
      return handleClickFile(state, dirent, actualIndex, keepFocus)
    // TODO decide on one name
    case DirentType.Directory:
      return handleClickDirectory(state, dirent, actualIndex)
    case DirentType.DirectoryExpanding:
      return handleClickDirectoryExpanding(state, dirent, actualIndex)
    case DirentType.DirectoryExpanded:
      return handleClickDirectoryExpanded(state, dirent, actualIndex)
    case DirentType.Symlink:
      return handleClickSymLink(state, dirent, state.focusedIndex)
    default:
      break
  }
}

export const handleClickAt = (state, x, y) => {
  const index = getIndexFromPosition(state, x, y)
  return handleClick(state, index)
}

export const handleClickCurrent = (state) => {
  return handleClick(state, state.focusedIndex - state.minLineY)
}

export const handleClickCurrentButKeepFocus = (state) => {
  return handleClick(
    state,
    state.focusedIndex - state.minLineY,
    /* keepFocus */ true
  )
}

export const scrollUp = () => {}

export const scrollDown = () => {}
// export const handleBlur=()=>{}

const handleClickSymLink = async (state, dirent, index) => {
  const realPath = await FileSystem.getRealPath(dirent.path)
  const type = await FileSystem.stat(realPath)
  switch (type) {
    case DirentType.File:
      return handleClickFile(state, dirent, index)
    default:
      throw new Error(`unsupported file type ${type}`)
  }
}

const handleArrowRightDirectoryExpanded = (state, dirent) => {
  if (state.focusedIndex === state.items.length - 1) {
    return state
  }
  const nextDirent = state.items[state.focusedIndex + 1]
  if (nextDirent.depth === dirent.depth + 1) {
    return focusIndex(state, state.focusedIndex + 1)
  }
}

export const handleArrowRight = async (state) => {
  if (state.focusedIndex === -1) {
    return state
  }
  const dirent = state.items[state.focusedIndex]
  switch (dirent.type) {
    case DirentType.File:
      return state
    case DirentType.Directory:
      return handleClickDirectory(state, dirent, state.focusedIndex)
    case DirentType.DirectoryExpanded:
      return handleArrowRightDirectoryExpanded(state, dirent)
    case DirentType.Symlink:
      return handleClickSymLink(state, dirent, state.focusedIndex)
    default:
      throw new Error(`unsupported file type ${dirent.type}`)
  }
}

const focusParentFolder = (state) => {
  const parentStartIndex = getParentStartIndex(state.items, state.focusedIndex)
  if (parentStartIndex === -1) {
    return state
  }
  return focusIndex(state, parentStartIndex)
}

export const handleArrowLeft = (state) => {
  if (state.focusedIndex === -1) {
    return state
  }
  const dirent = state.items[state.focusedIndex]
  switch (dirent.type) {
    case DirentType.Directory:
    case DirentType.File:
      return focusParentFolder(state)
    case DirentType.DirectoryExpanded:
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
  const dirent = state.items[index]
  if (!isImage(dirent)) {
    // TODO preload content maybe when it is a long hover
    return state
  }
  const { top, itemHeight, left, root } = state
  const uri = `${root}${dirent.path}`
  const newTop = top + index * itemHeight
  const right = left
  await Command.execute(
    /* ImagePreview.show */ 9081,
    /* uri */ uri,
    /* top */ newTop,
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

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  const { minLineY, itemHeight } = state
  const maxLineY = minLineY + Math.round(dimensions.height / itemHeight)
  return {
    ...state,
    ...dimensions,
    maxLineY,
  }
}

export const expandAll = async (state) => {
  const { items, focusedIndex } = state
  if (focusedIndex === -1) {
    return state
  }
  const dirent = items[focusedIndex]
  const depth = dirent.depth
  const newDirents = [...items]
  // TODO fetch child dirents in parallel
  for (const dirent of newDirents) {
    if (dirent.depth === depth && dirent.type === DirentType.Directory) {
      // TODO expand
      // TODO avoid mutating state here
      dirent.type = DirentType.DirectoryExpanding
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
      dirent.type = DirentType.DirectoryExpanded
      // await expand(state, dirent.index)
    }
  }
  return {
    ...state,
    items: newDirents,
  }
}

const isTopLevel = (dirent) => {
  return dirent.depth === 1
}

const toCollapsedDirent = (dirent) => {
  if (dirent.type === DirentType.DirectoryExpanded) {
    return {
      ...dirent,
      type: DirentType.Directory,
    }
  }
  return dirent
}

export const collapseAll = (state) => {
  const { items } = state
  const newDirents = items.filter(isTopLevel).map(toCollapsedDirent)
  return {
    ...state,
    items: newDirents,
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

const mergeVisibleWithHiddenItems = (visibleItems, hiddenItems) => {
  const hiddenItemRoot = hiddenItems[0].path
  const merged = [...hiddenItems]
  const seen = Object.create(null)
  const unique = []
  for (const item of merged) {
    if (seen[item.path]) {
      continue
    }
    seen[item.path] = true
    unique.push(item)
  }
  const ordered = []

  // depth one
  //   let depth=1
  //   while(true){
  //     for(const item of unique){
  //       if(item.depth===depth){
  //         ordered.push(item)
  //       }
  //     }
  // break
  //   }
  // const getChildren = (path) => {
  //   const children = []
  //   for (const item of unique) {
  //     if (item.path.startsWith(path) && item.path !== path) {
  //       ordered.push(item)
  //     }
  //   }
  //   return children
  // }
  // for (const item of unique) {
  //   for (const potentialChild of unique) {
  //     if (
  //       potentialChild.path.startsWith(item.path) &&
  //       potentialChild.path !== item.path
  //     ) {
  //       ordered.push(potentialChild)
  //     }
  //   }
  // }
  // const refreshedRoots = Object.create(null)
  // for (const hiddenItem of hiddenItems) {
  //   const parent = hiddenItem.path.slice(0, hiddenItem.path.lastIndexOf('/'))
  //   refreshedRoots[parent] = true
  // }
  // const mergedDirents = []
  // for(const v)
  // console.log({ hiddenItems })
  // for (const visibleItem of visibleItems) {
  //   console.log({ visibleItem, hiddenItemRoot, hiddenItems })
  //   if (visibleItem.path === hiddenItemRoot) {
  //     // TODO update aria posinset and aria setsize
  //     mergedDirents.push(...hiddenItems)
  //   } else {
  //     for (const hiddenItem of hiddenItems) {
  //       if (hiddenItem.path === visibleItem.path) {
  //         continue
  //       }
  //     }
  //     mergedDirents.push(visibleItem)
  //   }
  // }

  return unique
}

const orderDirents = (dirents) => {
  if (dirents.length === 0) {
    return dirents
  }
  // const parentMap = Object.create(null)
  // for(const dirent of dirents){
  //   const parentPath = dirent.slice(0, dirent.lastIndexOf('/'))
  //   parentMap[parentPath]||=[]
  //   parentMap[parentPath].push(dirent)
  // }
  const withDeepChildren = (parent) => {
    const children = []
    for (const dirent of dirents) {
      if (
        dirent.depth === parent.depth + 1 &&
        dirent.path.startsWith(parent.path)
      ) {
        children.push(dirent)
      }
    }
    return [parent, ...children]
  }
  const topLevelDirents = dirents.filter(isTopLevel)

  const ordered = topLevelDirents.flatMap(withDeepChildren)
  return ordered
}

// TODO maybe just insert items into explorer and refresh whole explorer
const revealItemHidden = async (state, uri) => {
  const { root, pathSeparator, items } = state
  const pathParts = getPathParts(root, uri, pathSeparator)
  const pathPartsToReveal = getPathPartsToReveal(root, pathParts, items)
  const pathPartsChildren = await Promise.all(
    pathPartsToReveal.map(getPathPartChildren)
  )
  const pathPartsChildrenFlat = pathPartsChildren.flat(1)
  const orderedPathParts = orderDirents(pathPartsChildrenFlat)
  const mergedDirents = mergeVisibleWithHiddenItems(items, orderedPathParts)
  const index = getIndex(mergedDirents, uri)
  return {
    ...state,
    items: mergedDirents,
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
  const { items } = state
  const index = getIndex(items, uri)
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
}

export const hasFunctionalRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
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
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY
    )
  },
  apply(oldState, newState) {
    const oldFocusedIndex = oldState.focused
      ? oldState.focusedIndex - oldState.minLineY
      : -2
    const newFocusedIndex = newState.focused
      ? newState.focusedIndex - newState.minLineY
      : -2
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Explorer',
      /* method */ 'setFocusedIndex',
      /* oldindex */ oldFocusedIndex,
      /* newIndex */ newFocusedIndex,
    ]
  },
}

const renderDropTargets = {
  isEqual(oldState, newState) {
    return oldState.dropTargets === newState.dropTargets
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Explorer',
      /* method */ 'setDropTargets',
      /* oldDropTargets */ oldState.dropTargets,
      /* newDropTargets */ newState.dropTargets,
    ]
  },
}

export const render = [renderItems, renderDropTargets, renderFocusedIndex]
