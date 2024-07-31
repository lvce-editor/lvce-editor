import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'
import * as GetActiveEditor from '../GetActiveEditor/GetActiveEditor.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import type { FindState } from './ViewletFindTypes.ts'

export const create = (uid: number): FindState => {
  return {
    value: '',
    ariaAnnouncement: '',
    matches: new Uint32Array(),
    matchIndex: -1,
    matchCount: 0,
    uid,
    replaceExpanded: false,
    useRegularExpression: false,
    matchCase: false,
    matchWholeWord: false,
    replacement: '',
    editorUid: 0,
  }
}

export const getPosition = () => {
  const editor = GetActiveEditor.getActiveEditor()
  if (!editor) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }
  }
  const width = 300
  const height = 30
  const paddingTop = 10
  const paddingRight = 20
  const x = editor.x + editor.width - width - paddingRight
  const y = editor.y + paddingTop
  return {
    y,
    x,
    width,
    height,
  }
}

export const loadContent = async (state: FindState) => {
  const editor = GetActiveEditor.getActiveEditor()
  if (!editor) {
    return state
  }
  const { value, matches, matchCount, matchIndex } = await EditorWorker.invoke('FindWidget.loadContent', editor.uid)
  return {
    ...state,
    value,
    matches,
    matchIndex,
    matchCount,
    editorUId: editor.uid,
  }
}

export const handleInput = async (state: FindState, value: string): Promise<FindState> => {
  // TODO keep whole state and rendering in editor worker
  const newState = await EditorWorker.invoke('FindWidget.handleInput', state, value)
  return newState
}

export const handleFocus = (state: FindState): FindState => {
  Focus.setFocus(FocusKey.FindWidget)
  return state
}

export const handleBlur = (state: FindState): FindState => {
  Focus.setFocus(FocusKey.Empty)
  return state
}

// TODO this function should be synchronous
export const focusIndex = async (state: FindState, index: number): Promise<FindState> => {
  const newState = await EditorWorker.invoke('FindWidget.focusIndex', state, index)
  return newState
}

export const focusFirst = async (state: FindState): Promise<FindState> => {
  const newState = await EditorWorker.invoke('FindWidget.focusFirst', state)
  return newState
}

export const focusLast = async (state: FindState): Promise<FindState> => {
  const newState = await EditorWorker.invoke('FindWidget.focusLast', state)
  return newState
}

export const focusNext = async (state: FindState): Promise<FindState> => {
  const newState = await EditorWorker.invoke('FindWidget.focusNext', state)
  return newState
}

export const focusPrevious = async (state: FindState): Promise<FindState> => {
  const newState = await EditorWorker.invoke('FindWidget.focusPrevious', state)
  return newState
}

export const close = async (state: FindState): Promise<FindState> => {
  const { uid } = state
  await Viewlet.closeWidget(uid)
  return {
    ...state,
    disposed: true,
  }
}
