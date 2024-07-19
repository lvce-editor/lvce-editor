import * as Command from '../Command/Command.js'
import * as Completions from '../Completions/Completions.js'
import * as ReplaceRange from '../EditorCommand/EditorCommandReplaceRange.js'
import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

const getEditor = () => {
  return Viewlet.getState(ViewletModuleId.EditorText)
}

const getEdits = async (state, editor, completionItem) => {
  // @ts-ignore
  const { leadingWord, uid } = state
  const word = completionItem.label
  const resolvedItem = await Completions.resolveCompletion(editor, word, completionItem)
  const inserted = resolvedItem ? resolvedItem.snippet : word
  // TODO type and dispose commands should be sent to renderer process at the same time
  const { selections } = editor
  const [startRowIndex, startColumnIndex] = selections
  const leadingWordLength = leadingWord.length
  const replaceRange = new Uint32Array([startRowIndex, startColumnIndex - leadingWordLength, startRowIndex, startColumnIndex])
  const changes = ReplaceRange.replaceRange(editor, replaceRange, [inserted], '')
  return changes
}

const select = async (state, completionItem) => {
  const { uid } = state
  const editor = getEditor()
  const changes = await getEdits(state, editor, completionItem)
  const index = editor.widgets.indexOf(ViewletModuleId.EditorCompletion)
  if (index !== -1) {
    editor.widgets.splice(index, 1)
    editor.completionState = EditorCompletionState.None
    editor.completionUid = 0
  }
  await Command.execute('Editor.applyEdit', changes)
  await Viewlet.dispose(uid)
  return state
}

export const selectIndex = (state, index) => {
  const { items } = state
  if (index === -1) {
    return state
  }
  if (index > items.length) {
    throw new Error('index too large')
  }
  const actualIndex = index
  const completionItem = items[actualIndex]
  return select(state, completionItem)
}
