import * as Assert from '../Assert/Assert.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as Icon from '../Icon/Icon.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Logger from '../Logger/Logger.js'
import * as SourceControl from '../SourceControl/SourceControl.js'
import * as Workspace from '../Workspace/Workspace.js'
// TODO when accept input is invoked multiple times, it should not lead to errors

/**
 * @enum {string}
 */
const UiStrings = {
  Add: 'Add',
  Restore: 'Restore',
  OpenFile: 'Open File',
}

export const create = () => {
  return {
    merge: [],
    index: [],
    untracked: [],
    workingTree: [],
    disposed: false,
    inputValue: '',
    displayItems: [],
    buttonIndex: -1,
    enabledProviderIds: [],
  }
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const handleInput = (state, text) => {
  Assert.string(text)
  return {
    ...state,
    inputValue: text,
  }
}

export const acceptInput = async (state) => {
  const { inputValue, enabledProviderIds } = state
  if (enabledProviderIds.length === 0) {
    Logger.info(`[ViewletSourceControl] no source control provider found`)
    return state
  }
  const providerId = enabledProviderIds[0]
  await SourceControl.acceptInput(providerId, inputValue)
  return {
    ...state,
    inputValue: '',
  }
}

const getChangedFiles = async (enabledProviderIds) => {
  const allChangedFiles = []
  for (const providerId of enabledProviderIds) {
    const changedFiles = await SourceControl.getChangedFiles(providerId)
    allChangedFiles.push(...changedFiles)
  }
  return {
    index: [],
    merge: [],
    untracked: [],
    workingTree: allChangedFiles,
    gitRoot: '',
  }
}

const getDisplayItems = (workingTree) => {
  const displayItems = []
  const setSize = workingTree.length
  for (let i = 0; i < workingTree.length; i++) {
    const item = workingTree[i]
    const baseName = Workspace.pathBaseName(item.file)
    const folderName = item.file.slice(0, -baseName.length - 1)
    displayItems.push({
      file: item.file,
      label: baseName,
      detail: folderName,
      posInSet: i + 1,
      setSize,
      icon: IconTheme.getFileIcon({ name: item.file }),
    })
  }
  return displayItems
}

export const loadContent = async (state) => {
  const root = Workspace.state.workspacePath
  const scheme = GetProtocol.getProtocol(root)
  console.log('loading content')
  const enabledProviderIds = await SourceControl.getEnabledProviderIds(scheme, root)
  console.log({ enabledProviderIds })
  const changedFiles = await getChangedFiles(enabledProviderIds)
  console.log({ changedFiles })
  const displayItems = getDisplayItems(changedFiles.workingTree)
  return {
    ...state,
    index: changedFiles.index,
    merge: changedFiles.merge,
    untracked: changedFiles.untracked,
    workingTree: changedFiles.workingTree,
    gitRoot: changedFiles.gitRoot,
    displayItems,
    enabledProviderIds,
  }
}

const updateIcon = (displayItem) => {
  return {
    ...displayItem,
    icon: IconTheme.getFileIcon({ name: displayItem.file }),
  }
}

export const updateIcons = (state) => {
  const { displayItems } = state
  const newDisplayItems = displayItems.map(updateIcon)
  return {
    ...state,
    displayItems: newDisplayItems,
  }
}

export const handleIconThemeChange = (state) => {
  return updateIcons(state)
}

export const handleClick = async (state, index) => {
  const item = state.workingTree[index]
  const absolutePath = `${state.gitRoot}/${item.file}`
  // TODO handle error
  const [fileBefore, fileNow] = await Promise.all([SourceControl.getFileBefore(item.file), FileSystem.readFile(absolutePath)])
  const content = `before:\n${fileBefore}\n\n\nnow:\n${fileNow}`
  // const content
  // await Main.openRawText(`diff://${absolutePath}`, content, 'plaintext')
  // await Main.openAbsolutePath(absolutePath)
}

export const handleMouseOver = (state, index) => {
  return {
    ...state,
    buttonIndex: index,
    buttons: [
      {
        label: UiStrings.OpenFile,
        icon: Icon.GoToFile,
      },
      {
        label: UiStrings.Restore,
        icon: Icon.Discard,
      },
      {
        label: UiStrings.Add,
        icon: Icon.Add,
      },
    ],
  }
}

export const handleClickAdd = async (state, index) => {
  const { displayItems } = state
  const item = displayItems[index]
  const { file } = item
  await SourceControl.add(file)
  return state
}

export const handleClickRestore = (state, index) => {
  return state
}

export const handleClickDiscard = (state, index) => {
  return state
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}

export const hasFunctionalRender = true

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.inputValue === newState.inputValue
  },
  apply(oldState, newState) {
    return [/* method */ 'setInputValue', /* value */ newState.inputValue]
  },
}

const renderChangedFiles = {
  isEqual(oldState, newState) {
    return oldState.displayItems === newState.displayItems
  },
  apply(oldState, newState) {
    return [/* method */ 'setChangedFiles', /* changedFiles */ newState.displayItems]
  },
}

const renderButtons = {
  isEqual(oldState, newState) {
    return oldState.buttonIndex === newState.buttonIndex && oldState.buttons === newState.buttons
  },
  apply(oldState, newState) {
    return [/* method */ 'setItemButtons', /* index */ newState.buttonIndex, /* buttons */ newState.buttons]
  },
}

export const render = [renderValue, renderChangedFiles, renderButtons]
