import * as Command from '../Command/Command.js'
import * as GetDisplayReferences from '../GetDisplayReferences/GetDisplayReferences.js'
import * as GetReferencesFileCount from '../GetReferencesFileCount/GetReferencesFileCount.js'
import * as GetReferencesMessage from '../GetReferencesMessage/GetReferencesMessage.js'
import * as LocationType from '../LocationType/LocationType.js'
import * as ListIndex from '../ListIndex/ListIndex.js'

export const create = (id, uri, x, y, width, height, args) => {
  return {
    references: [],
    message: '',
    displayReferences: [],
    focusedIndex: -1,
    id,
    args,
  }
}

// TODO speed up this function by 130% by not running activation event (onReferences) again and again
// e.g. (21ms activation event, 11ms getReferences) => (11ms getReferences)
export const loadContent = async (state, getReferences) => {
  const references = await getReferences()
  const displayReferences = GetDisplayReferences.getDisplayReferences(references)
  const fileCount = GetReferencesFileCount.getFileCount(references)
  const message = GetReferencesMessage.getMessage(references.length, fileCount)
  return {
    ...state,
    references,
    displayReferences,
    message,
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
