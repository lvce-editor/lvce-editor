import * as Assert from '../Assert/Assert.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as SourceControlActions from '../SourceControlActions/SourceControlActions.js'

// TODO when accept input is invoked multiple times, it should not lead to errors

export const create = (id) => {
  return {
    uid: id,
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
