import * as Assert from '../Assert/Assert.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Logger from '../Logger/Logger.js'
import * as SourceControl from '../SourceControl/SourceControl.js'
import * as SourceControlActions from '../SourceControlActions/SourceControlActions.js'

// TODO when accept input is invoked multiple times, it should not lead to errors

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
    buttons: [],
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
    return oldState.displayItems === newState.displayItems && oldState.buttonIndex === newState.buttonIndex && oldState.buttons === newState.buttons
  },
  apply(oldState, newState) {
    return [/* method */ 'setItemButtons', /* oldIndex */ oldState.buttonIndex, /* index */ newState.buttonIndex, /* buttons */ newState.buttons]
  },
}

export const render = [renderValue, renderChangedFiles, renderButtons]
