import * as Assert from '../Assert/Assert.js'
import * as FuzzySearch from '../FuzzySearch/FuzzySearch.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as EditorBlur from './EditorCommandBlur.js'
import * as EditorPosition from './EditorCommandPosition.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

const handleBlur = () => {
  close()
}

/**
 *
 * @param {string} line
 * @param {number} columnIndex
 * @returns
 */
const getLeadingWord = (line, columnIndex) => {
  console.log({ line })
  Assert.string(line)
  Assert.number(columnIndex)
  for (let i = columnIndex - 1; i >= 0; i--) {
    if (!RE_CHARACTER.test(line[i])) {
      console.log({ i, columnIndex })
      return line.slice(i + 1, columnIndex)
    }
  }
  return line.slice(0, columnIndex)
}

const filterCompletionItems = (completionItems, leadingWord) => {
  const filterCompletionItem = (completionItem) => {
    const labelMatch = FuzzySearch.fuzzySearch(
      leadingWord,
      completionItem.label
    )
    return labelMatch
  }
  console.log({ completionItems, leadingWord })
  const filtered = completionItems.filter(filterCompletionItem)
  return filtered
}

const handleSelectionChange = (editor, selectionChanges) => {
  const selection = selectionChanges[0]
  const end = selection.end
  if (end.rowIndex !== state.rowIndex) {
    close()
    return
  }
  const line = editor.lines[end.rowIndex]
  const leadingWord = getLeadingWord(line, end.columnIndex)
  const oldStart = state.columnIndex - state.leadingWord.length
  const newStart = end.columnIndex - leadingWord.length
  if (oldStart !== newStart) {
    close()
    return
  }
  // TODO move completions widget and filter

  // TODO this doesn't work for variable width characters (unicode/emoji)

  const filteredCompletionItems = filterCompletionItems(
    state.completionItems,
    leadingWord
  )
  state.filteredCompletionItems = filteredCompletionItems
  state.leadingWord = leadingWord
  console.log({ leadingWord })
  const x = EditorPosition.x(editor, editor.cursor)
  const y = EditorPosition.y(editor, editor.cursor)
  RendererProcess.send([
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'EditorCompletion',
    /* method */ 'show',
    /* x */ x,
    /* y */ y,
    /* completionItems */ filteredCompletionItems,
    /* reason */ 1,
  ])
}

const handleCursorChange = (anyEditor, cursorChange) => {
  console.log('cursor changed')
}

// TODO there are still race conditions in this function:
// - when open is called twice, previous dom nodes can either be reused or the previous dom nodes must be disposed

export const open = async (editor, openingReason = 1) => {
  const viewlet = ViewletManager.create(
    ViewletManager.getModule,
    'EditorCompletion',
    'Widget',
    'builtin://',
    0,
    0,
    0,
    0
  )

  await ViewletManager.load(viewlet)
  return editor

  // if (state.isOpened) {
  //   // TODO filter
  //   console.log('is already open')
  //   return
  // }
  // const loadingDelay = Preferences.get('completions.loadingDelay')

  // console.log({ loadingDelay })
  // state.abortController.abort()
  // const abortController = new AbortController()
  // state.abortController = abortController
  // EditorBlur.registerListener(handleBlur) // TODO don't like side effect here

  // // TODO when editor is disposed, close completions

  // GlobalEventBus.addListener('editor.selectionChange', handleSelectionChange)
  // GlobalEventBus.addListener('editor.cursorChange', handleCursorChange)
  // state.isOpened = true
  // state.openingReason = openingReason
  // state.focusedIndex = 0
  // state.rowIndex = editor.cursor.rowIndex
  // state.columnIndex = editor.cursor.columnIndex
  // state.editor = editor
  // const line = editor.lines[editor.cursor.rowIndex]
  // state.leadingWord = getLeadingWord(line, editor.cursor.columnIndex)
  // // TODO race condition: when blur occurs before items arrive, should not show items
  // await RendererProcess.invoke(
  //   /* Viewlet.load */ 3030,
  //   /* id */ 'EditorCompletion'
  // )
  // if (abortController.signal.aborted) {
  //   console.info('canceled')
  //   return
  // }
  // await RendererProcess.invoke(
  //   /* Viewlet.openWidget */ 3030,
  //   /* id */ 'EditorCompletion'
  // )
  // if (abortController.signal.aborted) {
  //   console.info('canceled')
  //   return
  // }
  // state.loadingTimeout = setTimeout(showLoading, loadingDelay)
  // if (state.loadingTimeout !== -1) {
  //   clearTimeout(state.loadingTimeout)
  // }
  // if (abortController.signal.aborted) {
  //   console.info('canceled')
  //   return
  // }
  // state.completionItems = newCompletionItems

  // const filteredCompletionItems = filterCompletionItems(
  //   state.completionItems,
  //   state.leadingWord
  // )
  // state.filteredCompletionItems = filteredCompletionItems

  // const x = EditorPosition.x(editor, editor.cursor)
  // const y = EditorPosition.y(editor, editor.cursor)
  // // TODO race condition: might already be dispose after each of these calls

  // if (newCompletionItems.length === 0 && state.openingReason === 0) {
  //   return
  // }

  // await RendererProcess.invoke(
  //   /* Viewlet.send */ 'Viewlet.send',
  //   /* id */ 'EditorCompletion',
  //   /* method */ 'show',
  //   /* x */ x,
  //   /* y */ y,
  //   /* items */ filteredCompletionItems,
  //   /* reason */ state.openingReason,
  //   /* focusedIndex */ state.focusedIndex
  // )
}

export const advance = (word) => {
  const includesWord = (completionItem) => {
    return completionItem.includes(word)
  }
  const filteredCompletions = state.completionItems.filter(includesWord)
  RendererProcess.send([
    /* EditorCompletion.open */ 836,
    /* items */ filteredCompletions,
    /* reason */ state.openingReason,
  ])
}

// export const onDidType = () => {}

// TODO possible race condition
// also should cancel when new open request comes in

const RE_CHARACTER = new RegExp(/^\p{L}/, 'u')

const isCharacter = (text) => {
  return RE_CHARACTER.test(text)
}

// TODO trigger characters should be specific per language id
const isTriggerCharacter = (text) => {
  return text === '<' || text === '.'
}

export const openFromType = async (editor, text) => {
  // if (isCharacter(text) || isTriggerCharacter(text)) {
  //   await open(editor, 0)
  // } else if (state.isOpened) {
  //   await close()
  // }
  return Viewlet.state.instances['EditorText'].state
}

export const close = async (editor) => {
  EditorBlur.removeListener(handleBlur)
  GlobalEventBus.removeListener('editor.selectionChange', handleSelectionChange)
  GlobalEventBus.removeListener('editor.cursorChange', handleCursorChange)
  await Viewlet.dispose('EditorCompletion')
  return editor
}
