import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.js'
import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.js'
import * as GetFileExtension from '../GetFileExtension/GetFileExtension.js'
import * as Height from '../Height/Height.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as OpenFolder from '../OpenFolder/OpenFolder.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
import * as RendererWorkerCommandType from '../RendererWorkerCommandType/RendererWorkerCommandType.js'
import * as SortExplorerItems from '../SortExplorerItems/SortExplorerItems.js'
import * as Viewlet from '../Viewlet/Viewlet.js' // TODO should not import viewlet manager -> avoid cyclic dependency
import * as Workspace from '../Workspace/Workspace.js'
import { focusIndex } from './ViewletExplorerFocusIndex.js'
import { getChildDirents, getIndexFromPosition, getParentEndIndex } from './ViewletExplorerShared.js'
// TODO viewlet should only have create and refresh functions
// every thing else can be in a separate module <viewlet>.lazy.js
// and  <viewlet>.ipc.js

// viewlet: creating | refreshing | done | disposed
// TODO recycle viewlets (maybe)

// TODO instead of root string, there should be a root dirent

export const create = (id, uri, x, y, width, height, args, parentUid) => {
  Assert.number(id)
  return {
    uid: id,
    parentUid,
    root: '',
    items: [],
    focusedIndex: -1,
    focused: false,
    hoverIndex: -1,
    x,
    y,
    width,
    height,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 0,
    pathSeparator: PathSeparatorType.Slash,
    version: 0,
    editingIndex: -1,
    itemHeight: Height.ListItem,
    dropTargets: [],
    excluded: [],
    editingValue: '',
    editingType: ExplorerEditingType.None,
    editingIcon: '',
  }
}

export const loadContent = async (state, savedState) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.loadContent', state, savedState)
  return newState
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

// TODO rename dirents to items, then can use virtual list component directly
export const setDeltaY = (state, deltaY) => {
  return ExplorerViewWorker.invoke('Explorer.setDeltaY', state, deltaY)
}

export const handleWheel = (state, deltaMode, deltaY) => {
  return setDeltaY(state, state.deltaY + deltaY)
}

export const getFocusedDirent = (state) => {
  const { focusedIndex, minLineY, items } = state
  const dirent = items[focusedIndex + minLineY]
  return dirent
}

// TODO support multiselection and removing multiple dirents
export const removeDirent = async (state) => {
  return ExplorerViewWorker.invoke('Explorer.removeDirent', state)
}

export const renameDirent = (state) => {
  const { focusedIndex, items } = state
  const item = items[focusedIndex]
  Focus.setFocus(FocusKey.ExplorerEditBox)
  return {
    ...state,
    editingIndex: focusedIndex,
    editingType: ExplorerEditingType.Rename,
    editingValue: item.name,
  }
}

export const cancelEdit = (state) => {
  return ExplorerViewWorker.invoke('Explorer.cancelEdit')
}

export const copyRelativePath = async (state) => {
  return ExplorerViewWorker.invoke('Explorer.copyRelativePath', state)
}

export const copyPath = async (state) => {
  return ExplorerViewWorker.invoke('Explorer.copyPath', state)
}

export const openContainingFolder = async (state) => {
  return ExplorerViewWorker.invoke('Explorer.openContainingFolder', state)
}

const newDirent = async (state, editingType) => {
  Focus.setFocus(FocusKey.ExplorerEditBox)
  // TODO do it like vscode, select position between folders and files
  const { focusedIndex, items } = state
  if (focusedIndex >= 0) {
    const dirent = items[focusedIndex]
    if (dirent.type === DirentType.Directory) {
      // TODO handle error
      await handleClickDirectory(state, dirent, focusIndex)
    }
  }
  return {
    ...state,
    editingIndex: focusedIndex,
    editingType,
    editingValue: '',
  }
}

// TODO much shared logic with newFolder
export const newFile = (state) => {
  return newDirent(state, ExplorerEditingType.CreateFile)
}

export const updateEditingValue = (state, value) => {
  const editingIcon = IconTheme.getFileIcon({ name: value })
  return {
    ...state,
    editingValue: value,
    editingIcon,
  }
}

export const handleFocus = (state) => {
  Focus.setFocus(FocusKey.Explorer)
  return state
}

export const refresh = (state) => {
  console.log('TODO refresh explorer')
  return state
}

export const newFolder = (state) => {
  return newDirent(state, ExplorerEditingType.CreateFolder)
}

const handleClickFile = async (state, dirent, index, keepFocus = false) => {
  await Command.execute(/* Main.openAbsolutePath */ 'Main.openUri', /* absolutePath */ dirent.path, /* focus */ !keepFocus)
  return {
    ...state,
    focusedIndex: index,
    focused: keepFocus,
  }
}

const handleClickDirectory = async (state, dirent, index, keepFocus) => {
  dirent.type = DirentType.DirectoryExpanding
  // TODO handle error
  const dirents = await getChildDirents(state.pathSeparator, dirent)
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
  const newDirents = [...state2.items]
  newDirents.splice(newIndex + 1, 0, ...dirents)
  dirent.type = DirentType.DirectoryExpanded
  dirent.icon = IconTheme.getIcon(dirent)
  const { height, itemHeight, minLineY } = state2
  // TODO when focused index has changed while expanding, don't update it
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
  return {
    ...state,
    items: newDirents,
    focusedIndex: newIndex,
    focused: keepFocus,
    maxLineY,
  }
}

const handleClickDirectoryExpanding = (state, dirent, index, keepFocus) => {
  dirent.type = DirentType.Directory
  dirent.icon = IconTheme.getIcon(dirent)
  return {
    ...state,
    focusedIndex: index,
    focused: keepFocus,
  }
}

const handleClickDirectoryExpanded = (state, dirent, index, keepFocus) => {
  const { minLineY, maxLineY, itemHeight } = state
  dirent.type = DirentType.Directory
  dirent.icon = IconTheme.getIcon(dirent)
  const endIndex = getParentEndIndex(state.items, index)
  const removeCount = endIndex - index - 1
  // TODO race conditions and side effects are everywhere
  const newDirents = [...state.items]
  newDirents.splice(index + 1, removeCount)
  const newTotal = newDirents.length
  if (newTotal < maxLineY) {
    const visibleItems = Math.min(maxLineY - minLineY, newTotal)
    const newMaxLineY = Math.min(maxLineY, newTotal)
    const newMinLineY = newMaxLineY - visibleItems
    const deltaY = newMinLineY * itemHeight
    return {
      ...state,
      items: newDirents,
      focusedIndex: index,
      focused: keepFocus,
      minLineY: newMinLineY,
      maxLineY: newMaxLineY,
      deltaY,
    }
  }
  return {
    ...state,
    items: newDirents,
    focusedIndex: index,
    focused: keepFocus,
  }
}

const getClickFn = (direntType) => {
  switch (direntType) {
    case DirentType.File:
    case DirentType.SymLinkFile:
      return handleClickFile
    case DirentType.Directory:
    case DirentType.SymLinkFolder:
      return handleClickDirectory
    case DirentType.DirectoryExpanding:
      return handleClickDirectoryExpanding
    case DirentType.DirectoryExpanded:
      return handleClickDirectoryExpanded
    case DirentType.Symlink:
      return handleClickSymLink
    case DirentType.CharacterDevice:
      throw new Error('Cannot open character device files')
    case DirentType.BlockDevice:
      throw new Error('Cannot open block device files')
    case DirentType.Socket:
      throw new Error('Cannot open socket files')
    default:
      throw new Error(`unsupported dirent type ${direntType}`)
  }
}

export const handleClick = (state, index, keepFocus = false) => {
  const { items, minLineY } = state
  if (index === -1) {
    return focusIndex(state, -1)
  }
  const actualIndex = index + minLineY
  const dirent = items[actualIndex]
  if (!dirent) {
    console.warn(`[explorer] dirent at index ${actualIndex} not found`, state)
    return state
  }
  const clickFn = getClickFn(dirent.type)
  return clickFn(state, dirent, actualIndex, keepFocus)
}

export const handleClickAt = (state, button, x, y) => {
  if (button !== MouseEventType.LeftClick) {
    return state
  }

  const index = getIndexFromPosition(state, x, y)
  return handleClick(state, index)
}

export const handleClickCurrent = (state) => {
  return handleClick(state, state.focusedIndex - state.minLineY)
}

export const handleClickCurrentButKeepFocus = (state) => {
  return handleClick(state, state.focusedIndex - state.minLineY, /* keepFocus */ true)
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

export const handleArrowRight = async (state) => {
  return ExplorerViewWorker.invoke('Explorer.handleArrowRight', state)
}

export const handleArrowLeft = (state) => {
  return ExplorerViewWorker.invoke('Explorer.handleArrowLeft', state)
}

export const handleUpload = async (state, dirents) => {
  const { root, pathSeparator } = state
  for (const dirent of dirents) {
    // TODO switch
    // TODO symlink might not be possible to be copied
    // TODO create folder if type is 2
    if (dirent.type === /* File */ 1) {
      // TODO reading text might be inefficient for binary files
      // but not sure how else to send them via jsonrpc
      const content = await dirent.file.text()
      const absolutePath = [root, dirent.file.name].join(pathSeparator)
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

const IMAGE_EXTENSIONS = new Set(['.png', '.jpeg', '.jpg', '.gif', '.svg', '.ico'])

const isImage = (dirent) => {
  // TODO explorer state must be updated when changing folder
  // This is just a workaround
  if (!dirent) {
    return false
  }
  const fileExtension = GetFileExtension.getFileExtension(dirent.path)
  return IMAGE_EXTENSIONS.has(fileExtension)
}

export const handleMouseEnter = async (state, index) => {
  const { items } = state
  const dirent = items[index]
  if (!isImage(dirent)) {
    // TODO preload content maybe when it is a long hover
    return state
  }
  const { top, itemHeight, x, root } = state
  const uri = `${root}${dirent.path}`
  const newTop = top + index * itemHeight
  const right = x
  await Command.execute(/* ImagePreview.show */ 9081, /* uri */ uri, /* top */ newTop, /* right */ right)
}

// TODO what happens when mouse leave and anther mouse enter event occur?
// should update preview instead of closing and reopening

export const handleMouseLeave = async (state) => {
  // await Command.execute(/* ImagePreview.hide */ 9082)
  return state
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
  await Command.execute(/* ClipBoard.writeNativeFiles */ 243, /* type */ 'copy', /* files */ files)
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
  return ExplorerViewWorker.invoke('Explorer.expandAll', state)
}

const isTopLevel = (dirent) => {
  return dirent.depth === 1
}

export const collapseAll = (state) => {
  return ExplorerViewWorker.invoke('Explorer.collapseAll', state)
}

export const handleBlur = (state) => {
  return ExplorerViewWorker.invoke('Explorer.handleBlur', state)
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
    parts.push({
      path: partUri,
      depth: depth++,
      root,
      pathSeparator,
    })
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
  const children = getChildDirents(pathPart.pathSeparator, pathPart)
  return children
}

const mergeVisibleWithHiddenItems = (visibleItems, hiddenItems) => {
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
  // @ts-ignore
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
  // for (const visibleItem of visibleItems) {
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
      if (dirent.depth === parent.depth + 1 && dirent.path.startsWith(parent.path)) {
        children.push(dirent, ...withDeepChildren(dirent))
      }
    }
    return [parent, ...children]
  }
  const topLevelDirents = dirents.filter(isTopLevel)
  const ordered = topLevelDirents.flatMap(withDeepChildren)
  return ordered
}

const scrollInto = (index, minLineY, maxLineY) => {
  const diff = maxLineY - minLineY
  const smallerHalf = Math.floor(diff / 2)
  const largerHalf = diff - smallerHalf
  if (index < minLineY) {
    return {
      newMinLineY: index - smallerHalf,
      newMaxLineY: index + largerHalf,
    }
  }
  if (index >= maxLineY) {
    return {
      newMinLineY: index - smallerHalf,
      newMaxLineY: index + largerHalf,
    }
  }
  return {
    newMinLineY: minLineY,
    newMaxLineY: maxLineY,
  }
}

// TODO maybe just insert items into explorer and refresh whole explorer
const revealItemHidden = async (state, uri) => {
  const { root, pathSeparator, items, minLineY, maxLineY } = state
  const pathParts = getPathParts(root, uri, pathSeparator)
  if (pathParts.length === 0) {
    return state
  }
  const pathPartsToReveal = getPathPartsToReveal(root, pathParts, items)
  const pathPartsChildren = await Promise.all(pathPartsToReveal.map(getPathPartChildren))
  const pathPartsChildrenFlat = pathPartsChildren.flat(1)
  const orderedPathParts = orderDirents(pathPartsChildrenFlat)
  const mergedDirents = mergeVisibleWithHiddenItems(items, orderedPathParts)
  const index = getIndex(mergedDirents, uri)
  if (index === -1) {
    throw new Error(`File not found in explorer ${uri}`)
  }
  const { newMinLineY, newMaxLineY } = scrollInto(index, minLineY, maxLineY)
  return {
    ...state,
    items: mergedDirents,
    focused: true,
    focusedIndex: index,
    minLineY: newMinLineY,
    maxLineY: newMaxLineY,
  }
}

const revealItemVisible = (state, index) => {
  const { minLineY, maxLineY } = state
  const { newMinLineY, newMaxLineY } = scrollInto(index, minLineY, maxLineY)
  return {
    ...state,
    focused: true,
    focusedIndex: index,
    minLineY: newMinLineY,
    maxLineY: newMaxLineY,
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

export const handleClickOpenFolder = async (state) => {
  await OpenFolder.openFolder()
  return state
}
