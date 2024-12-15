import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.js'
import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'
import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'
import * as GetFileExtension from '../GetFileExtension/GetFileExtension.js'
import * as Height from '../Height/Height.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
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

export const updateIcons = (state) => {
  return ExplorerViewWorker.invoke('Explorer.updateIcons', state)
}

export const handleLanguagesChanged = (state) => {
  return ExplorerViewWorker.invoke('Explorer.handleIconThemeChange', state)
}

export const handleWorkspaceChange = async (state) => {
  return ExplorerViewWorker.invoke('Explorer.handleWorkspaceChange', state)
}

export const handleIconThemeChange = (state) => {
  return ExplorerViewWorker.invoke('Explorer.handleIconThemeChange', state)
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
  return ExplorerViewWorker.invoke('Explorer.renameDirent', state)
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

// TODO much shared logic with newFolder
export const newFile = (state) => {
  return ExplorerViewWorker.invoke('Explorer.newFile', state)
}

export const updateEditingValue = (state, value) => {
  return ExplorerViewWorker.invoke('Explorer.updateEditingValue', state, value)
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
  return ExplorerViewWorker.invoke('Explorer.newFolder', state)
}

export const handleClick = (state, index, keepFocus = false) => {
  return ExplorerViewWorker.invoke('Explorer.handleClick', state, index, keepFocus)
}

export const handleClickAt = (state, button, x, y) => {
  return ExplorerViewWorker.invoke('Explorer.handleClickAt', state, button, x, y)
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

export const handleArrowRight = async (state) => {
  return ExplorerViewWorker.invoke('Explorer.handleArrowRight', state)
}

export const handleArrowLeft = (state) => {
  return ExplorerViewWorker.invoke('Explorer.handleArrowLeft', state)
}

export const handleUpload = async (state, dirents) => {
  return ExplorerViewWorker.invoke('Explorer.handleUpload', state, dirents)
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
  return ExplorerViewWorker.invoke('Explorer.handleCopy', state)
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

export const collapseAll = (state) => {
  return ExplorerViewWorker.invoke('Explorer.collapseAll', state)
}

export const handleBlur = (state) => {
  return ExplorerViewWorker.invoke('Explorer.handleBlur', state)
}

export const revealItem = async (state, uri) => {
  return ExplorerViewWorker.invoke('Explorer.revealItem', state, uri)
}

export const handleClickOpenFolder = async (state) => {
  return ExplorerViewWorker.invoke('Explorer.handleClickOpenFolder', state)
}
