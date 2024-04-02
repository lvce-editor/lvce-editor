import * as Assert from '../Assert/Assert.ts'
import * as DirentType from '../DirentType/DirentType.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as VirtualList from '../VirtualList/VirtualList.js'
import * as SourceControlActions from '../SourceControlActions/SourceControlActions.js'
import * as ViewletSourceControlLoadContent from './ViewletSourceControlLoadContent.js'

// TODO when accept input is invoked multiple times, it should not lead to errors

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    x,
    y,
    width,
    height,
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
    providerId: '',
    splitButtonEnabled: false,
    ...VirtualList.create({
      itemHeight: 20,
      headerHeight: 60,
      minimumSliderSize: 20,
    }),
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
  if (displayItem.type === DirentType.File) {
    return {
      ...displayItem,
      icon: IconTheme.getFileIcon({ name: displayItem.file }),
    }
  }
  return displayItem
}

export const updateIcons = (state) => {
  const { items } = state
  const newDisplayItems = items.map(updateIcon)
  return {
    ...state,
    items: newDisplayItems,
  }
}

export const handleIconThemeChange = (state) => {
  return updateIcons(state)
}

export const handleMouseOver = async (state, index) => {
  const { items, providerId, buttonIndex } = state
  if (index === buttonIndex) {
    return state
  }
  const item = items[index]
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

export const handleWorkspaceChange = (state) => {
  return ViewletSourceControlLoadContent.loadContent(state)
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
