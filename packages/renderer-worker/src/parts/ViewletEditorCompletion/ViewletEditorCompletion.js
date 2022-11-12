import * as Command from '../Command/Command.js'
import * as Completions from '../Completions/Completions.js'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as EditorShowMessage from '../EditorCommand/EditorCommandShowMessage.js'
import * as EditorCompletionMap from '../EditorCompletionMap/EditorCompletionMap.js'
import * as FilterCompletionItems from '../FilterCompletionItems/FilterCompletionItems.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as Height from '../Height/Height.js'

export const create = (id, uri, top, left, width, height) => {
  return {
    focusedIndex: 0,
    isOpened: false,
    openingReason: 0,
    editor: undefined,
    rowIndex: 0,
    columnIndex: 0,
    leadingWord: '',
    loadingTimeout: -1,
    unfilteredItems: [],
    items: [],
    left: 0,
    top: 0,
    minLineY: 0,
    maxLineY: 0,
    itemHeight: Height.CompletionItem,
    width: 250,
    height: 150,
    deltaY: 0,
  }
}

const getEditor = () => {
  return Viewlet.getState('EditorText')
}

const getLabel = (item) => {
  return item.label
}

const getDisplayErrorMessage = (error) => {
  const message = `${error}`
  const errorPrefix = 'Error: '
  if (message.startsWith(errorPrefix)) {
    return message.slice(errorPrefix.length)
  }
  return message
}

export const loadContent = async (state) => {
  const editor = getEditor()
  const unfilteredItems = await Completions.getCompletions(editor)
  const items = FilterCompletionItems.filterCompletionItems(unfilteredItems, '')
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const left = EditorPosition.x(editor, rowIndex, columnIndex)
  const top = EditorPosition.y(editor, rowIndex, columnIndex)
  const newMaxLineY = Math.min(items.length, 8)
  return {
    ...state,
    unfilteredItems,
    items,
    left,
    top,
    maxLineY: newMaxLineY,
  }
}

export const handleError = async (error) => {
  const displayErrorMessage = getDisplayErrorMessage(error)
  const editor = getEditor()
  await EditorShowMessage.editorShowMessage(
    /* editor */ editor,
    /* rowIndex */ 0,
    /* columnIndex */ 0,
    /* message */ displayErrorMessage,
    /* isError */ true
  )
}

export const loadingContent = () => {
  const editor = getEditor()
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  const changes = [
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'EditorCompletion',
    /* method */ 'showLoading',
    /* x */ x,
    /* y */ y,
  ]
  return changes
}

export const handleSelectionChange = (state, selectionChanges) => {}

export const advance = (state, word) => {
  const filteredItems = FilterCompletionItems.filterCompletionItems(
    state.items,
    word
  )
  return {
    ...state,
    filteredItems,
  }
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const hasFunctionalRender = true

const renderPosition = {
  isEqual(oldState, newState) {
    return oldState.x === newState.x && oldState.y === newState.y
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'EditorCompletion',
      /* method */ 'setPosition',
      /* x */ newState.x,
      /* y */ newState.y,
    ]
  },
}

const getVisibleItems = (filteredItems, minLineY, maxLineY) => {
  const visibleItems = []
  for (let i = minLineY; i < maxLineY; i++) {
    const filteredItem = filteredItems[i]
    visibleItems.push({
      label: getLabel(filteredItem),
      icon: EditorCompletionMap.getIcon(filteredItem),
    })
  }
  return visibleItems
}

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY
    )
  },
  apply(oldState, newState) {
    const visibleItems = getVisibleItems(
      newState.items,
      newState.minLineY,
      newState.maxLineY
    )
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'EditorCompletion',
      /* method */ 'setItems',
      /* items */ visibleItems,
      /* reason */ 1,
    ]
  },
}

const renderBounds = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY
    )
  },
  apply(oldState, newState) {
    const { left, top, width, height } = newState
    return [
      /* Viewlet.send */ 'Viewlet.setBounds',
      /* id */ 'EditorCompletion',
      /* left */ left,
      /* top */ top,
      /* width */ width,
      /* height */ height,
    ]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'EditorCompletion',
      /* method */ 'setFocusedIndex',
      /* oldFocusedIndex */ oldState.focusedIndex,
      /* newFocusedIndex */ newState.focusedIndex,
    ]
  },
}

export const render = [
  renderItems,
  renderPosition,
  renderBounds,
  renderFocusedIndex,
]

export * from '../VirtualList/VirtualList.js'
