import * as Command from '../Command/Command.js'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as ExtensionHostCompletion from '../ExtensionHost/ExtensionHostCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as EditorShowMessage from '../EditorCommand/EditorCommandShowMessage.js'
import * as EditorCompletionType from '../EditorCompletionType/EditorCompletionType.js'

export const create = (id, uri, top, left, width, height) => {
  console.log({ id, uri, top, left, width, height })
  return {
    completionItems: [],
    focusedIndex: 0,
    isOpened: false,
    openingReason: 0,
    editor: undefined,
    abortController: new AbortController(),
    rowIndex: 0,
    columnIndex: 0,
    leadingWord: '',
    loadingTimeout: -1,
    filteredCompletionItems: [],
    visibleItems: [],
    x: 0,
    y: 0,
  }
}

// TODO possible to do this with events/state machine instead of promises -> enables canceling operations / concurrent calls
const getCompletions = async (editor) => {
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  // Editor.sync(editor)
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const completions = await ExtensionHostCompletion.executeCompletionProvider(
    editor,
    offset
  )
  return completions
}

const filterCompletionItems = (completionItems, word) => {
  const includesWord = (completionItem) => {
    return completionItem.label.includes(word)
  }
  const filteredCompletions = completionItems.filter(includesWord)
  return filteredCompletions
}

const getEditor = () => {
  return Viewlet.getState('EditorText')
}

const getLabel = (item) => {
  return item.label
}

const EditorCompletionClassNames = {
  [EditorCompletionType.Property]: 'IconProperty',
  [EditorCompletionType.Value]: 'IconValue',
  [EditorCompletionType.Function]: 'IconFunction',
  [EditorCompletionType.Variable]: 'IconVariable',
  [EditorCompletionType.Keyword]: 'IconKeyword',
}

const defaultClassName = 'IconDefault'

const getIconClassName = (item) => {
  return EditorCompletionClassNames[item.kind] || defaultClassName
}

const getVisibleItems = (filteredItems) => {
  const visibleItems = []
  for (const filteredItem of filteredItems) {
    visibleItems.push({
      label: getLabel(filteredItem),
      icon: getIconClassName(filteredItem),
    })
  }
  return visibleItems
  // for(const )
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
  const completionItems = await getCompletions(editor)
  const filteredCompletionItems = filterCompletionItems(completionItems, '')
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  const visibleItems = getVisibleItems(filteredCompletionItems)
  console.log({ completionItems, filteredCompletionItems, visibleItems })
  return {
    ...state,
    completionItems,
    filteredCompletionItems,
    visibleItems,
    x,
    y,
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
  console.log('show loading')
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

export const contentLoaded = () => {
  // noop
}

export const handleSelectionChange = (state, selectionChanges) => {}

export const advance = (state, word) => {
  const filteredCompletionItems = filterCompletionItems(
    state.completionItems,
    word
  )
  return {
    ...state,
    filteredCompletionItems,
  }
}

const getInsertSnippet = (word, leadingWord) => {
  if (word.startsWith(leadingWord)) {
    return word.slice(leadingWord.length)
  }
  return word
}

const select = async (state, completionItem) => {
  const { leadingWord } = state
  const word = completionItem.label
  const snippet = getInsertSnippet(word, leadingWord)
  // TODO type and dispose commands should be sent to renderer process at the same time
  await Command.execute(/* Editor.type */ 'Editor.type', /* text */ snippet)
  return {
    ...state,
    disposed: true,
  }
}

export const selectIndex = (state, index) => {
  const completionItem = state.filteredCompletionItems[index]
  return select(state, completionItem)
}

export const focusIndex = (state, index) => {
  return {
    ...state,
    focusedIndex: index,
  }
}

export const focusFirst = (state) => {
  return focusIndex(state, 0)
}

export const focusLast = (state) => {
  return focusIndex(state, state.completionItems.length - 1)
}

export const focusPrevious = (state) => {
  if (state.focusedIndex === 0) {
    return focusLast(state)
  }
  return focusIndex(state, state.focusedIndex - 1)
}

export const focusNext = (state) => {
  if (state.focusedIndex === state.completionItems.length - 1) {
    return focusFirst(state)
  }
  return focusIndex(state, state.focusedIndex + 1)
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

const renderItems = {
  isEqual(oldState, newState) {
    return oldState.visibleItems === newState.visibleItems
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'EditorCompletion',
      /* method */ 'setItems',
      /* items */ newState.visibleItems,
      /* reason */ 1,
    ]
  },
}

export const render = [renderItems, renderPosition]
