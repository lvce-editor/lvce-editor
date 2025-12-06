import * as Assert from '../Assert/Assert.ts'
import * as DirentType from '../DirentType/DirentType.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as SourceControlActions from '../SourceControlActions/SourceControlActions.js'
import * as SourceControlWorker from '../SourceControlWorker/SourceControlWorker.js'
import * as Workspace from '../Workspace/Workspace.js'

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
    badgeCount: 0,
  }
}

export const loadContent = async (state, savedState) => {
  await SourceControlWorker.invoke(
    'SourceControl.create2',
    state.uid,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    Workspace.state.workspacePath, // TODO use workspace uri
  )
  await SourceControlWorker.invoke('SourceControl.loadContent', state.uid, savedState)
  const diffResult = await SourceControlWorker.invoke('SourceControl.diff2', state.uid)
  const commands = await SourceControlWorker.invoke('SourceControl.render2', state.uid, diffResult)
  const actionsDom = await SourceControlWorker.invoke('SourceControl.renderActions2', state.uid)
  const badgeCount = await SourceControlWorker.invoke('SourceControl.getBadgeCount', state.uid)
  // if (badgeCount > 0) {
  //   const newState = {
  //     ...state,
  //     commands,
  //     actionsDom,
  //     badgeCount,
  //   }
  //   ViewletStates.setState(state.uid, newState)
  //   ViewletStates.setRenderedState(state.uid, newState)
  //   await Command.execute('Layout.handleBadgeCountChange')
  // }
  return {
    ...state,
    commands,
    actionsDom,
    badgeCount,
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
  return loadContent(state)
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

export const hotReload = async (state) => {
  if (state.isHotReloading) {
    return state
  }
  // TODO avoid mutation
  state.isHotReloading = true
  // possible TODO race condition during hot reload
  // there could still be pending promises when the worker is disposed
  const savedState = await SourceControlWorker.invoke('SourceControl.saveState', state.uid)
  await SourceControlWorker.restart('SourceControl.terminate')
  const oldState = {
    ...state,
    items: [],
  }
  await SourceControlWorker.invoke(
    'SourceControl.create2',
    state.uid,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    Workspace.state.workspacePath, // TODO use workspace uri
  )
  await SourceControlWorker.invoke('SourceControl.loadContent', state.uid, savedState)
  const diffResult = await SourceControlWorker.invoke('SourceControl.diff2', state.uid)
  const commands = await SourceControlWorker.invoke('SourceControl.render2', oldState.uid, diffResult)
  return {
    ...oldState,
    commands,
    isHotReloading: false,
  }
}
