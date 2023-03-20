import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as Icon from '../Icon/Icon.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Logger from '../Logger/Logger.js'
import * as SourceControl from '../SourceControl/SourceControl.js'
import * as SourceControlActions from '../SourceControlActions/SourceControlActions.js'
import * as Workspace from '../Workspace/Workspace.js'

// TODO when accept input is invoked multiple times, it should not lead to errors

/**
 * @enum {string}
 */
const UiStrings = {
  Add: 'Add',
  Restore: 'Restore',
  OpenFile: 'Open File',
  Changes: 'Changes',
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
    isExpanded: true,
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

const getGroups = async (enabledProviderIds) => {
  const allGroups = []
  for (const providerId of enabledProviderIds) {
    const groups = await SourceControl.getGroups(providerId)
    allGroups.push(...groups)
  }
  return {
    allGroups,
    gitRoot: '',
  }
}

const getDisplayItemsGroup = (group, isExpanded) => {
  const displayItems = []
  const { id, label, items } = group
  if (!items) {
    throw new Error(`Source control group is missing an items property`)
  }
  const length = items.length
  const type = isExpanded ? 'directory-expanded' : 'directory'
  const icon = isExpanded ? Icon.ChevronDown : Icon.ChevronRight
  if (length > 0) {
    displayItems.push({
      file: '',
      label: label,
      detail: '',
      posInSet: 1,
      setSize: 1,
      icon,
      decorationIcon: '',
      decorationIconTitle: '',
      decorationStrikeThrough: false,
      type,
      badgeCount: length,
      groupId: id,
    })
  }
  if (isExpanded) {
    for (let i = 0; i < length; i++) {
      const item = items[i]
      const baseName = Workspace.pathBaseName(item.file)
      const folderName = item.file.slice(0, -baseName.length - 1)
      displayItems.push({
        file: item.file,
        label: baseName,
        detail: folderName,
        posInSet: i + 1,
        setSize: length,
        icon: IconTheme.getFileIcon({ name: item.file }),
        decorationIcon: item.icon,
        decorationIconTitle: item.iconTitle,
        decorationStrikeThrough: item.strikeThrough,
        type: 'file',
        badgeCount: 0,
        groupId: id,
      })
    }
  }
  return displayItems
}

const getDisplayItems = (allGroups, isExpanded) => {
  const displayItems = []
  for (const group of allGroups) {
    const groupDisplayItems = getDisplayItemsGroup(group, isExpanded)
    displayItems.push(...groupDisplayItems)
  }
  return displayItems
}

export const loadContent = async (state) => {
  const root = Workspace.state.workspacePath
  const scheme = GetProtocol.getProtocol(root)
  const enabledProviderIds = await SourceControl.getEnabledProviderIds(scheme, root)
  const { allGroups, gitRoot } = await getGroups(enabledProviderIds)
  const isExpanded = true
  const displayItems = getDisplayItems(allGroups, isExpanded)
  return {
    ...state,
    allGroups,
    gitRoot,
    displayItems,
    enabledProviderIds,
    isExpanded,
  }
}

const updateIcon = (displayItem) => {
  if (displayItem.type === 'file') {
    return {
      ...displayItem,
      icon: IconTheme.getFileIcon({ name: displayItem.file }),
    }
  }
  return displayItem
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

const handleClickFile = async (state, item) => {
  const absolutePath = `${state.gitRoot}/${item.file}`
  // TODO handle error
  const [fileBefore, fileNow] = await Promise.all([SourceControl.getFileBefore(item.file), FileSystem.readFile(absolutePath)])
  const content = `before:\n${fileBefore}\n\n\nnow:\n${fileNow}`
  return state
}

const handleClickDirectory = (state, item) => {
  const { allGroups } = state
  const isExpanded = true
  const displayItems = getDisplayItems(allGroups, isExpanded)
  return {
    ...state,
    displayItems,
    isExpanded,
  }
}
const handleClickDirectoryExpanded = (state, item) => {
  const { allGroups } = state
  const isExpanded = false
  const displayItems = getDisplayItems(allGroups, isExpanded)
  return {
    ...state,
    displayItems,
    isExpanded,
  }
}

export const handleClick = async (state, index) => {
  const { displayItems } = state
  const item = displayItems[index]
  console.log('type', item.type)
  switch (item.type) {
    case 'directory':
      return handleClickDirectory(state)
    case 'directory-expanded':
      return handleClickDirectoryExpanded(state)
    case 'file':
      return handleClickFile(state, item)
    default:
      console.warn(`unknown item type: ${item.type}`)
      return state
  }
}

export const handleMouseOver = async (state, index) => {
  const { displayItems, providerId, buttonIndex } = state
  if (index === buttonIndex) {
    return state
  }
  const item = displayItems[index]
  if (!item) {
    return state
  }
  const actions = await SourceControlActions.getSourceControlActions(providerId, item.groupId, item.type)
  return {
    ...state,
    buttonIndex: index,
    buttons: actions,
  }
}

export const handleMouseOut = (state, index) => {
  if (index === -1) {
    return {
      ...state,
      buttonIndex: -1,
      buttons: [],
    }
  }
  return state
}

export const handleButtonClick = async (state, clickedIndex) => {
  const { buttonIndex, buttons, displayItems } = state
  const button = buttons[clickedIndex]
  const item = displayItems[buttonIndex]
  if (!button) {
    return
  }
  await Command.execute(button.command, item.file)
  return state
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
    return [/* method */ 'setItemButtons', /* oldIndex */ oldState.buttonIndex, /* index */ newState.buttonIndex, /* buttons */ newState.buttons]
  },
}

export const render = [renderValue, renderChangedFiles, renderButtons]
