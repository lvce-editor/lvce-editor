import * as EditorWorker from '../EditorWorker/EditorWorker.js'
import * as GetActiveEditor from '../GetActiveEditor/GetActiveEditor.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    id,
    x: 0,
    y: 0,
    width: 250,
    height: 150,
    maxHeight: 150,
    sanitzedHtml: '',
    documentation: '',
    lineInfos: [],
    diagnostics: [],
    resizedWidth: 250,
  }
}

export const loadContent = async (state, savedState, position) => {
  const editor = GetActiveEditor.getActiveEditor()
  console.log('editor uid', editor.uid)
  const hoverInfo = await EditorWorker.invoke('Hover.getHoverInfo', editor.uid, position)
  console.log({ editor, hoverInfo, position })
  if (!hoverInfo) {
    return state
  }
  const { lineInfos, documentation, x, y, matchingDiagnostics } = hoverInfo
  return {
    ...state,
    lineInfos,
    documentation,
    x,
    y,
    diagnostics: matchingDiagnostics,
  }
}

export const handleSashPointerDown = (state, eventX, eventY) => {
  return state
}

export const handleSashPointerMove = (state, eventX, eventY) => {
  // @ts-ignore
  const { x, y } = state
  const minWidth = 100
  const newWidth = Math.max(eventX - x, minWidth)
  return {
    ...state,
    resizedWidth: newWidth,
  }
}

export const handleSashPointerUp = (state, eventX, eventY) => {
  return state
}