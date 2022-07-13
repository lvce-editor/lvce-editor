import * as Command from '../Command/Command.js'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as ExtensionHostCompletion from '../ExtensionHost/ExtensionHostCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as IconTheme from '../IconTheme/IconTheme.js'

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
  // Editor.sync(editor)
  const offset = TextDocument.offsetAt(editor, editor.cursor)
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

const getIconClassName = (item) => {
  switch (item.kind) {
    case /* Property */ 1:
      return 'IconProperty'
    case /* Value */ 2:
      return 'IconValue'
    case /* Function */ 3:
      return 'IconFunction'
    case /* Variable */ 4:
      return 'IconVariable'
    case /* Keyword */ 5:
      return 'IconKeyword'
    case /* Folder */ 6:
      return IconTheme.getFolderIcon({ name: item.label })
    case /* File */ 7:
      return IconTheme.getFileIcon({ name: item.label })
    default:
      return 'IconDefault'
  }
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

export const loadContent = async (state) => {
  const editor = getEditor()
  const completionItems = await getCompletions(editor)
  const filteredCompletionItems = filterCompletionItems(completionItems, '')
  const x = EditorPosition.x(editor, editor.cursor)
  const y = EditorPosition.y(editor, editor.cursor)
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

export const loadingContent = () => {
  const editor = getEditor()
  console.log('show loading')
  const x = EditorPosition.x(editor, editor.cursor)
  const y = EditorPosition.y(editor, editor.cursor)
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

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  const changes = []
  if (oldState.x !== newState.x || oldState.y !== newState.y) {
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'EditorCompletion',
      /* method */ 'setPosition',
      /* x */ newState.x,
      /* y */ newState.y,
    ])
  }
  if (oldState.visibleItems !== newState.visibleItems) {
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'EditorCompletion',
      /* method */ 'setItems',
      /* items */ newState.visibleItems,
      /* reason */ 1,
    ])
  }
  console.log({ changes })
  return changes
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}
