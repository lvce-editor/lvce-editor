import * as Completions from '../Completions/Completions.js'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as EditorShowMessage from '../EditorCommand/EditorCommandShowMessage.js'
import * as EditorCompletionMap from '../EditorCompletionMap/EditorCompletionMap.js'
import * as FilterCompletionItems from '../FilterCompletionItems/FilterCompletionItems.js'
import * as Height from '../Height/Height.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as VirtualList from '../VirtualList/VirtualList.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    id,
    isOpened: false,
    openingReason: 0,
    editor: undefined,
    rowIndex: 0,
    columnIndex: 0,
    leadingWord: '',
    loadingTimeout: -1,
    unfilteredItems: [],
    x: 0,
    y: 0,
    width: 250,
    height: 150,
    ...VirtualList.create({
      headerHeight: 0,
      itemHeight: Height.CompletionItem,
      minimumSliderSize: Height.MinimumSliderSize,
    }),
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

const RE_WORD = /[\w\-]+$/

const getWordAtOffset = (editor) => {
  const { lines, selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const line = lines[rowIndex]
  const part = line.slice(0, columnIndex)
  const wordMatch = part.match(RE_WORD)
  if (wordMatch) {
    return wordMatch[0]
  }
  return ''
}

export const handleEditorType = (state, editor, text) => {
  const { unfilteredItems } = state
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  const wordAtOffset = getWordAtOffset(editor)
  const items = FilterCompletionItems.filterCompletionItems(unfilteredItems, wordAtOffset)
  const newMaxLineY = Math.min(items.length, 8)
  return {
    ...state,
    items,
    x,
    y,
    maxLineY: newMaxLineY,
  }
}

export const deleteCharacterLeft = (state, editor) => {
  const { unfilteredItems } = state
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  const wordAtOffset = getWordAtOffset(editor)
  const items = FilterCompletionItems.filterCompletionItems(unfilteredItems, wordAtOffset)
  const newMaxLineY = Math.min(items.length, 8)
  return {
    ...state,
    items,
    x,
    y,
    maxlineY: newMaxLineY,
  }
}

export const handleEditorClick = (state, editor) => {
  console.log('dispose completion')
  return {
    ...state,
    disposed: true,
  }
}

export const loadContent = async (state) => {
  const editor = getEditor()
  const unfilteredItems = await Completions.getCompletions(editor)
  const items = FilterCompletionItems.filterCompletionItems(unfilteredItems, '')
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  const newMaxLineY = Math.min(items.length, 8)
  // editor.hasCompletion = true
  editor.widgets = editor.widgets || []
  editor.widgets.push('EditorCompletion')
  return {
    ...state,
    unfilteredItems,
    items,
    x,
    y,
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
  const changes = [/* Viewlet.send */ 'Viewlet.send', /* id */ 'EditorCompletion', /* method */ 'showLoading', /* x */ x, /* y */ y]
  return changes
}

export const handleSelectionChange = (state, selectionChanges) => {}

export const advance = (state, word) => {
  const filteredItems = FilterCompletionItems.filterCompletionItems(state.items, word)
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
    return oldState.items === newState.items && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    const visibleItems = getVisibleItems(newState.items, newState.minLineY, newState.maxLineY)
    return [/* method */ 'setItems', /* items */ visibleItems, /* reason */ 1]
  },
}

const renderBounds = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.x === newState.x &&
      oldState.y === newState.y
    )
  },
  apply(oldState, newState) {
    const { x, y, width, height } = newState
    return [/* method */ 'setBounds', /* x */ x, /* y */ y, /* width */ width, /* height */ height]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    return [/* method */ 'setFocusedIndex', /* oldFocusedIndex */ oldState.focusedIndex, /* newFocusedIndex */ newState.focusedIndex]
  },
}

export const render = [renderItems, renderBounds, renderFocusedIndex]

export * from '../VirtualList/VirtualList.js'
