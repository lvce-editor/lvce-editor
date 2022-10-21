import * as Command from '../Command/Command.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const name = ViewletModuleId.Locations

export const create = (id, uri) => {
  return {
    references: [],
    message: '',
    displayReferences: [],
    focusedIndex: -1,
    id,
  }
}

const getMessage = (resultCount, fileCount) => {
  if (resultCount === 0) {
    return 'No Results'
  }
  if (resultCount === 1 && fileCount === 1) {
    return '1 result in 1 file'
  }
  if (fileCount === 1) {
    return `${resultCount} results in 1 file`
  }
  return `${resultCount} results in ${fileCount} files`
}

const getName = (uri) => {
  return uri.slice(uri.lastIndexOf('/') + 1)
}

const getDisplayReferences = (references) => {
  const fileMap = Object.create(null)
  const displayReferences = []
  let current = {
    uri: '',
    startOffset: 0,
    endOffset: 0,
    lineText: '',
  }
  let outerPosInSet = 1
  let innerPosInSet = 1
  let fileCount = 0
  let index = 0
  for (const reference of references) {
    if (reference.uri === current.uri) {
      displayReferences.push({
        depth: 2,
        posInSet: innerPosInSet++,
        setSize: 1,
        type: 'leaf',
        uri: '',
        name: '',
        lineText: reference.lineText,
        index: index++,
      })
    } else {
      fileCount++
      current = reference
      innerPosInSet = 1
      const name = getName(reference.uri)
      displayReferences.push({
        depth: 1,
        posInSet: outerPosInSet++,
        setSize: 1,
        type: 'expanded',
        uri: reference.uri,
        name,
        lineText: '',
        icon: IconTheme.getIcon({
          type: 'file',
          path: reference.uri,
          name,
        }),
        index: index++,
      })
      displayReferences.push({
        depth: 2,
        posInSet: innerPosInSet++,
        setSize: 1,
        type: 'leaf',
        uri: '',
        name: '',
        lineText: current.lineText,
        index: index++,
      })
    }
  }

  return {
    message: getMessage(references.length, fileCount),
    displayReferences,
  }
}

// TODO speed up this function by 130% by not running activation event (onReferences) again and again
// e.g. (21ms activation event, 11ms getReferences) => (11ms getReferences)
export const loadContent = async (state, getReferences) => {
  const references = await getReferences()
  const { message, displayReferences } = getDisplayReferences(references)
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
    case 'leaf':
      return selectIndexLead(state, index)
    case 'expanded':
      return selectIndexExpanded(state, index)
    case 'collapsed':
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

export const focusFirst = (state) => {
  if (state.displayReferences.length === 0) {
    return state
  }
  return focusIndex(state, 0)
}

export const focusPrevious = (state) => {
  if (state.focusedIndex === 0 || state.focusedIndex === -1) {
    return state
  }
  return focusIndex(state, state.focusedIndex - 1)
}

export const focusNext = (state) => {
  if (state.focusedIndex === state.displayReferences.length - 1) {
    return state
  }
  return focusIndex(state, state.focusedIndex + 1)
}

export const focusLast = (state) => {
  if (state.focusedIndex === state.displayReferences.length - 1) {
    return state
  }
  return focusIndex(state, state.displayReferences.length - 1)
}

export const selectCurrent = (state) => {
  if (state.focusedIndex === -1) {
    return state
  }
  return selectIndex(state, state.focusedIndex)
}

export const hasFunctionalRender = true

const renderLocations = {
  isEqual(oldState, newState) {
    return oldState.displayReferences === newState.displayReferences
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ newState.id,
      /* method */ 'setLocations',
      /* references */ newState.displayReferences,
    ]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ newState.id,
      /* method */ 'setMessage',
      /* message */ newState.message,
    ]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ newState.id,
      /* method */ 'setFocusedIndex',
      /* oldFocusedIndex */ oldState.focusedIndex,
      /* newFocusedIndex */ newState.focusedIndex,
    ]
  },
}

export const render = [renderFocusedIndex, renderLocations, renderMessage]
