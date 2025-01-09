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
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const updateIcons = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.updateIcons', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const handleLanguagesChanged = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.handleIconThemeChange', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const handleWorkspaceChange = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.handleWorkspaceChange', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const handleIconThemeChange = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.handleIconThemeChange', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

// TODO rename dirents to items, then can use virtual list component directly
export const setDeltaY = async (state, deltaY) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.setDeltaY', state, deltaY)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
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
  const newState = await ExplorerViewWorker.invoke('Explorer.removeDirent', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const renameDirent = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.renameDirent', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const cancelEdit = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.cancelEdit')
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const copyRelativePath = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.copyRelativePath', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const copyPath = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.copyPath', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const openContainingFolder = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.openContainingFolder', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

// TODO much shared logic with newFolder
export const newFile = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.newFile', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const updateEditingValue = async (state, value) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.updateEditingValue', state, value)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const handleFocus = (state) => {
  Focus.setFocus(FocusKey.Explorer)
  return state
}

export const refresh = (state) => {
  console.log('TODO refresh explorer')
  return state
}

export const newFolder = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.newFolder', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const handleClick = async (state, index, keepFocus = false) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.handleClick', state, index, keepFocus)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const handleClickAt = async (state, button, x, y) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.handleClickAt', state, button, x, y)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
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
  const newState = await ExplorerViewWorker.invoke('Explorer.handleArrowRight', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const handleArrowLeft = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.handleArrowLeft', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const handleUpload = async (state, dirents) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.handleUpload', state, dirents)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
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
  const newState = await ExplorerViewWorker.invoke('Explorer.expandAll', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const collapseAll = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.collapseAll', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const handleBlur = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.handleBlur', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const revealItem = async (state, uri) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.revealItem', state, uri)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const handleClickOpenFolder = async (state) => {
  const newState = await ExplorerViewWorker.invoke('Explorer.handleClickOpenFolder', state)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state, newState)
  newState.commands = commands
  return newState
}

export const hotReload = async (state) => {
  if (state.isHotReloading) {
    return state
  }
  // TODO avoid mutation
  state.isHotReloading = true
  // possible TODO race condition during hot reload
  // there could still be pending promises when the worker is disposed
  const savedState = await ExplorerViewWorker.invoke('Explorer.saveState', state)
  await ExplorerViewWorker.restart('Explorer.terminate')
  const oldState = {
    ...state,
    items: [],
  }
  const newState = await ExplorerViewWorker.invoke('Explorer.loadContent', state, savedState)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', oldState, newState)
  newState.commands = commands
  newState.isHotReloading = false
  return newState
}
