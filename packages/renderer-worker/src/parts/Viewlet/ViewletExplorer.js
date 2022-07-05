import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js' // TODO should not import shared process -> use command.execute instead (maybe)
import * as Workspace from '../Workspace/Workspace.js'
import * as Viewlet from '../Viewlet/Viewlet.js' // TODO should not import viewlet manager -> avoid cyclic dependency

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

const toDisplayDirents = (state, rawDirents, parentDirent) => {
  rawDirents.sort(compareDirent) // TODO maybe shouldn't mutate input argument, maybe sort after mapping
  // TODO figure out whether this uses too much memory (name,path -> redundant, depth could be computed on demand)
  const toDisplayDirent = (rawDirent, index) => {
    const path = parentDirent.path
      ? [parentDirent.path, rawDirent.name].join(state.pathSeparator)
      : [state.root, rawDirent.name].join(state.pathSeparator)
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

const getChildDirents = async (state, parentDirent) => {
  // TODO use event/actor based code instead, this is impossible to cancel right now
  // also cancel updating when opening new folder
  // const dispose = state => state.pendingRequests.forEach(cancelRequest)
  // TODO should use FileSystem directly in this case because it is globally available anyway
  // and more typesafe than Command.execute
  // and more performant
  const uri = parentDirent.path
  const rawDirents = await FileSystem.readDirWithFileTypes(uri)
  const displayDirents = toDisplayDirents(state, rawDirents, parentDirent)
  return displayDirents
}

// TODO instead of root string, there should be a root dirent

export const create = (id, uri, left, top, width, height) => {
  return {
    root: '',
    dirents: [],
    focusedIndex: -2,
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
  const dirents = await getTopLevelDirents({ root, pathSeparator })
  return {
    ...state,
    root,
    dirents,
    maxLineY: Math.round(state.height / ITEM_HEIGHT),
    pathSeparator,
  }
}

export const updateIcons = (state) => {
  for (const dirent of state.dirents) {
    dirent.icon = IconTheme.getIcon(dirent)
  }
}

export const contentLoaded = async (state) => {
  // console.trace({ state })
  // TODO execute command directly
  // TODO this should a promise and be awaited
  await scheduleDirents(state)
}

const getTopLevelDirents = ({ root, pathSeparator }) => {
  if (!root) {
    return []
  }
  return getChildDirents(
    { root, pathSeparator },
    {
      depth: 0,
      path: root,
      type: 'directory',
    }
  )
}

export const contentLoadedEffects = (state) => {
  // TODO why is this event emitted?
  GlobalEventBus.emitEvent('dirents.update', state.dirents)

  // TODO create should not have side effects
  // TODO dispose listener when explorer is disposed
  // TODO hoist function
  GlobalEventBus.addListener('languages.changed', async () => {
    updateIcons(state)
    await scheduleDirents(state)
  })

  // TODO hoist function
  GlobalEventBus.addListener('workspace.change', async () => {
    state.root = Workspace.state.workspacePath
    const newState = await loadContent(state)
    Viewlet.state.instances['Explorer'].state = newState
    await contentLoaded(newState)
    // TODO
  })

  GlobalEventBus.addListener('iconTheme.change', async () => {
    await contentLoaded(state)
  })
}

const getVisible = (state) => {
  return state.dirents.slice(state.minLineY, state.maxLineY)
}

const scheduleDirents = async (state) => {
  const visibleDirents = getVisible(state)
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'Explorer',
    /* method */ 'updateDirents',
    /* visibleDirents */ visibleDirents
  )
}

const updateViewport = (state) => {
  const minLineY = Math.round(state.deltaY / ITEM_HEIGHT)
  const maxLineY = minLineY + Math.round(state.height / ITEM_HEIGHT)
  // TODO this should be functional (return new state)
  state.minLineY = minLineY
  state.maxLineY = maxLineY
}

export const setDeltaY = async (state, deltaY) => {
  if (deltaY < 0) {
    deltaY = 0
  } else if (deltaY > state.dirents.length * ITEM_HEIGHT - state.height) {
    deltaY = Math.max(state.dirents.length * ITEM_HEIGHT - state.height, 0)
  }
  if (state.deltaY === deltaY) {
    return
  }
  state.deltaY = deltaY
  updateViewport(state)
  await scheduleDirents(state)
}

export const handleWheel = async (state, deltaY) => {
  await setDeltaY(state, state.deltaY + deltaY)
}

export const handleContextMenu = async (state, x, y, index) => {
  state.focusedIndex = index
  console.log('ctx menu', index, state)
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ 'explorer'
  )
}

export const getFocusedDirent = (state) => {
  const dirent = state.dirents[state.focusedIndex]
  return dirent
}

// TODO support multiselection and removing multiple dirents
export const removeDirent = async (state) => {
  if (state.focusedIndex < 0) {
    return
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
  console.log('remove dirent')
  const newVersion = ++state.version
  // TODO race condition
  // const newState = await loadContent(state)
  if (state.version !== newVersion || state.disposed) {
    return
  }
  // TODO is it possible to make this more functional instead of mutating state?
  // maybe every function returns a new state?
  const index = state.dirents.indexOf(dirent)
  let deleteEnd = index + 1

  for (; deleteEnd < state.dirents.length; deleteEnd++) {
    console.log({ dirent: state.dirents[deleteEnd] })
    if (state.dirents[deleteEnd].depth <= dirent.depth) {
      break
    }
  }
  const deleteCount = deleteEnd - index
  state.dirents.splice(index, deleteCount)
  let indexToFocus = -1

  if (state.dirents.length === 0) {
    indexToFocus = -1
  } else if (index < state.focusedIndex) {
    indexToFocus = state.focusedIndex - 1
  } else if (index === state.focusedIndex) {
    indexToFocus = Math.max(state.focusedIndex - 1, 0)
  } else {
    indexToFocus = Math.max(state.focusedIndex - 1, 0)
  }

  // TODO removing of file and setting focus should happen at the same time
  await scheduleDirents(state)
  await focusIndex(state, indexToFocus)
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
    // console.log(dirent, startIndex)
    console.log('check', dirent.path)
    if (dirent.depth > depth) {
      console.log('continue', dirent.path, startIndex)

      continue
    }
    if (dirent.depth < depth) {
      console.log('break', dirent.depth, depth)
      break
    }
    console.log({ startIndex })
    console.log('comp', compareDirent(dirent, newDirent))
    if (compareDirent(dirent, newDirent) === 1) {
      console.log('is smaller', dirent.path, newDirent.path)
      insertIndex = startIndex
      posInSet = dirent.posInSet
      // dirent.posInSet++
    } else {
      console.log('is larger', dirent.path, newDirent.path)
    }
  }
  startIndex++
  console.log({ insertIndex, startIndex })
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
      console.log('bigger', dirent.path)
      for (; endIndex < dirents.length; endIndex++) {
        const childDirent = dirents[endIndex]
        console.log(childDirent)
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

  console.log({ startIndex, endIndex, index, innerEndIndex, insertIndex })
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
  // TODO handle error
  // TODO should return folder to open
  // TODO use command.execute instead
  await SharedProcess.invoke(
    /* Native.openFolder */ 'Native.openFolder',
    /* path */ state.root
  )
}

const newDirent = async (state) => {
  // TODO do it like vscode, select position between folders and files
  const focusedIndex = state.focusedIndex
  const index = state.focusedIndex + 1
  if (focusedIndex >= 0) {
    const dirent = state.dirents[state.focusedIndex]
    console.log({ dirent, dirents: state.dirents, fi: state.focusedIndex })
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
}

// TODO much shared logic with newFolder
export const newFile = async (state) => {
  await newDirent(state)
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
}

export const cancelNewFile = async (state) => {
  await cancelDirent()
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
    return
  }
  // console.log({ index: editingIndex, dirent: state.dirents[editingIndex] })
  const parentFolder = getParentFolder(state.dirents, focusedIndex, state.root)
  console.log({ parentFolder, focusedIndex, state })
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
  console.log({ focusedIndex })
  console.log(state.dirents)
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
  console.log({ insertIndex })
  newDirent.setSize = setSize
  newDirent.posInSet = posInSet
  state.dirents.splice(insertIndex + 1, 0, newDirent)

  console.log(state.dirents)
  // TODO insert dirent here
  // await updateDirents(state)
  await contentLoaded(state)
}

// TODO much duplicate logic with acceptNewFolder
export const acceptNewFile = async (state) => {
  await acceptDirent(state, 'file')
}

export const acceptNewFolder = async (state) => {
  await acceptDirent(state, 'directory')
}

// TODO much copy paste with newFIle command
export const newFolder = async (state) => {
  await newDirent(state)
}

const handleClickFile = async (state, dirent, index) => {
  await Command.execute(
    /* Main.openAbsolutePath */ 'Main.openUri',
    /* absolutePath */ dirent.path
  )
}

const handleClickDirectory = async (state, dirent, index) => {
  dirent.type = 'directory-expanding'
  // TODO handle error
  const dirents = await getChildDirents(state, dirent)
  const newIndex = state.dirents.indexOf(dirent)
  if (newIndex === -1) {
    return
  }
  // console.log(state.dirents[index] === dirent)
  state.dirents.splice(newIndex + 1, 0, ...dirents)
  dirent.type = 'directory-expanded'
  dirent.icon = IconTheme.getIcon(dirent)
  await scheduleDirents(state)
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
}

const handleClickDirectoryExpanded = async (state, dirent, index) => {
  dirent.type = 'directory'
  dirent.icon = IconTheme.getIcon(dirent)
  const endIndex = getParentEndIndex(state.dirents, index)
  const removeCount = endIndex - index - 1
  // TODO race conditions and side effects are everywhere
  state.dirents.splice(index + 1, removeCount)
  await scheduleDirents(state)
}

export const handleClick = async (state, index) => {
  if (index === -1) {
    await focusIndex(state, -1)
    return
  }
  const actualIndex = index + state.minLineY
  state.focusedIndex = actualIndex
  const dirent = state.dirents[actualIndex]
  console.log('click', index)
  // TODO dirent type should be numeric
  switch (dirent.type) {
    case 'file':
      await handleClickFile(state, dirent, actualIndex)
      break
    // TODO decide on one name
    case 'folder':
    case 'directory':
      await handleClickDirectory(state, dirent, actualIndex)
      break
    case 'directory-expanding':
      await handleClickDirectoryExpanding(state, dirent, actualIndex)
      break
    case 'directory-expanded':
      await handleClickDirectoryExpanded(state, dirent, actualIndex)
      break
    default:
      break
  }
}

export const handleClickCurrent = async (state) => {
  await handleClick(state, state.focusedIndex)
}

export const focusIndex = async (state, index) => {
  const oldFocusedIndex = state.focusedIndex
  state.focusedIndex = index
  await RendererProcess.invoke(
    /* viewSend */ 'Viewlet.send',
    /* id */ 'Explorer',
    /* method */ 'setFocusedIndex',
    /* oldIndex */ oldFocusedIndex,
    /* newIndex */ state.focusedIndex
  )
}

export const focusNext = async (state) => {
  if (state.focusedIndex === state.dirents.length - 1) {
    return
  }
  await focusIndex(state, state.focusedIndex + 1)
}

export const focusPrevious = async (state) => {
  switch (state.focusedIndex) {
    case -1:
      if (state.dirents.length === 0) {
        break
      }
      await focusIndex(state, state.dirents.length - 1)
      break
    case 0:
      break
    default:
      await focusIndex(state, state.focusedIndex - 1)
      break
  }
}

export const focusFirst = async (state) => {
  if (state.dirents.length === 0 || state.focusedIndex === 0) {
    return
  }
  await focusIndex(state, 0)
}

export const focusLast = async (state) => {
  if (
    state.dirents.length === 0 ||
    state.focusedIndex === state.dirents.length - 1
  ) {
    return
  }
  await focusIndex(state, state.dirents.length - 1)
}

export const scrollUp = () => {}

export const scrollDown = () => {}
// export const handleBlur=()=>{}

export const handleArrowRight = async (state) => {
  if (state.focusedIndex === -1) {
    return
  }
  const dirent = state.dirents[state.focusedIndex]
  switch (dirent.type) {
    case 'file':
      break
    case 'directory':
      await handleClickDirectory(state, dirent, state.focusedIndex)
      break
    case 'directory-expanded':
      if (state.focusedIndex === state.dirents.length - 1) {
        break
      }
      const nextDirent = state.dirents[state.focusedIndex + 1]
      if (nextDirent.depth === dirent.depth + 1) {
        await focusIndex(state, state.focusedIndex + 1)
      }
      break
    default:
      break
  }
}

const focusParentFolder = async (state) => {
  const parentStartIndex = getParentStartIndex(
    state.dirents,
    state.focusedIndex
  )
  if (parentStartIndex === -1) {
    return
  }
  await focusIndex(state, parentStartIndex)
}

export const handleArrowLeft = async (state) => {
  if (state.focusedIndex === -1) {
    return
  }
  const dirent = state.dirents[state.focusedIndex]
  switch (dirent.type) {
    case 'directory':
    case 'file':
      await focusParentFolder(state)
      break
    case 'directory-expanded':
      await handleClickDirectoryExpanded(state, dirent, state.focusedIndex)
      break
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
    return
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

export const handleMouseLeave = async () => {
  // await Command.execute(/* ImagePreview.hide */ 9082)
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

export const handlePaste = async (state) => {
  const nativeFiles = await Command.execute(
    /* ClipBoard.readNativeFiles */ 'ClipBoard.readNativeFiles'
  )
  if (nativeFiles.type === 'none') {
    console.info('[ViewletExplorer/handlePaste] no paths detected')
    return
  }
  console.log({ nativeFiles })
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
  if (nativeFiles.type === 'copy') {
    for (const source of nativeFiles.files) {
      const target = `${state.root}${state.pathSeparator}${getBaseName(
        source,
        state.pathSeparator
      )}`
      await FileSystem.copy(source, target)
    }
    // await refresh(state)
    return
  }
  if (nativeFiles.type === 'cut') {
    for (const source of nativeFiles.files) {
      const target = `${state.root}/${getBaseName(source)}`
      await FileSystem.rename(source, target)
    }
    // await refresh(state)
  }
  // await refresh(state)
}

export const resize = (state, dimensions) => {
  const maxLineY = state.minLineY + Math.round(dimensions.height / ITEM_HEIGHT)
  const newState = {
    ...state,
    ...dimensions,
    maxLineY,
  }
  const visibleDirents = getVisible(newState)
  const commands = [
    [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Explorer',
      /* method */ 'updateDirents',
      /* visibleDirents */ visibleDirents,
    ],
  ]
  return {
    newState: {
      ...state,
      ...dimensions,
      maxLineY,
    },
    commands,
  }
}

export const expandAll = async (state) => {
  console.log('EXPAND ALL')
  const { dirents, focusedIndex } = state
  if (focusedIndex === -1) {
    return
  }
  const dirent = dirents[focusedIndex]
  const depth = dirent.depth
  for (const dirent of dirents) {
    if (dirent.depth === depth && dirent.type === 'directory') {
      // TODO expand
      dirent.type = 'directory-expanding'
      // TODO handle error
      const childDirents = await getChildDirents(state, dirent)
      const newIndex = dirents.indexOf(dirent)
      if (newIndex === -1) {
        continue
      }
      // console.log(state.dirents[index] === dirent)
      dirents.splice(newIndex + 1, 0, ...childDirents)
      dirent.type = 'directory-expanded'
      // await expand(state, dirent.index)
    }
  }
  console.log({ dirents: [...dirents] })
  await scheduleDirents(state)
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

export const collapseAll = async (state) => {
  const newDirents = state.dirents.filter(isTopLevel).map(toCollapsedDirent)
  state.dirents = newDirents
  await scheduleDirents(state)
}

export const handleBlur = async (state) => {
  await focusIndex(state, -2)
}
