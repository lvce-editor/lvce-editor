import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Command from '../Command/Command.js'
import * as ListIndex from '../ListIndex/ListIndex.js'
import * as LocationType from '../LocationType/LocationType.js'
import * as Platform from '../Platform/Platform.js'
import * as ReferencesWorker from '../ReferencesWorker/ReferencesWorker.js'

export const create = (id, uri, x, y, width, height, args) => {
  return {
    references: [],
    message: '',
    displayReferences: [],
    focusedIndex: -1,
    id,
    args,
    actionsDom: [],
    assetDir: AssetDir.assetDir,
    platform: Platform.getPlatform(),
  }
}

// TODO speed up this function by 130% by not running activation event (onReferences) again and again
// e.g. (21ms activation event, 11ms getReferences) => (11ms getReferences)
export const loadContent = async (state, savedState) => {
  await ReferencesWorker.invoke('References.create', state.id, state.uri, state.x, state.y, state.width, state.height, state.assetDir, state.platform)
  await ReferencesWorker.invoke('References.loadContent', state.id, savedState)
  const diff = await ReferencesWorker.invoke('References.diff2', state.id)
  const commands = await ReferencesWorker.invoke('References.render2', state.id, diff)
  const actionsDom = await ReferencesWorker.invoke('References.renderActions', state.id)
  return {
    ...state,
    commands,
    actionsDom,
  }
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

const getUri = (state, index) => {
  for (let i = index; i >= 0; i--) {
    if (state.displayReferences[i].depth === 1) {
      return state.displayReferences[i].uri
    }
  }
  return ''
}

const selectIndexLead = async (state, index) => {
  const uri = getUri(state, index)
  // TODO open file and jump to line
  await Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ uri)
  return {
    ...state,
    focusedIndex: index,
  }
}

const selectIndexExpanded = (state, index) => {
  // TODO expand

  return { ...state, focusedIndex: index }
}

const selectIndexCollapsed = (state, index) => {
  // TODO collapse

  return { ...state, focusedIndex: index }
}

export const selectIndex = (state, index) => {
  const displayReference = state.displayReferences[index]
  switch (displayReference.type) {
    case LocationType.Leaf:
      return selectIndexLead(state, index)
    case LocationType.Expanded:
      return selectIndexExpanded(state, index)
    case LocationType.Collapsed:
      return selectIndexCollapsed(state, index)
    default:
      console.warn(displayReference)
      return state
  }
}

export const focusIndex = (state, index) => {
  return {
    ...state,
    focusedIndex: index,
  }
}
export const hotReload = (state) => {
  return {
    ...state,
  }
}

export const focusFirst = (state) => {
  const { displayReferences } = state
  if (displayReferences.length === 0) {
    return state
  }
  const firstIndex = ListIndex.first()
  return focusIndex(state, firstIndex)
}

export const focusPrevious = (state) => {
  const { displayReferences, focusedIndex } = state
  const previousIndex = ListIndex.previousNoCycle(displayReferences, focusedIndex)
  return focusIndex(state, previousIndex)
}

export const focusNext = (state) => {
  const { displayReferences, focusedIndex } = state
  const nextIndex = ListIndex.nextNoCycle(displayReferences, focusedIndex)
  return focusIndex(state, nextIndex)
}

export const focusLast = (state) => {
  const { displayReferences } = state
  const lastIndex = ListIndex.last(displayReferences)
  return focusIndex(state, lastIndex)
}

export const selectCurrent = (state) => {
  if (state.focusedIndex === -1) {
    return state
  }
  return selectIndex(state, state.focusedIndex)
}

export const saveState = async (state) => {
  const savedState = await ReferencesWorker.invoke('References.saveState', state.uid)
  return savedState
}

export const renderActions = {
  isEqual(oldState, newState) {
    return JSON.stringify(oldState.actionsDom) === JSON.stringify(newState.actionsDom)
  },
  apply(oldState, newState) {
    const dom = newState.actionsDom
    return dom
  },
}
