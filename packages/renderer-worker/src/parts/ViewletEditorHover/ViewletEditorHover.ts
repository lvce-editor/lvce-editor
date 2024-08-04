import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
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

const render = async (oldState: any, newState: any): Promise<any> => {
  // @ts-ignore
  const commands = await EditorWorker.invoke('Hover.render', oldState, newState)
  return commands
}

export const loadContent = async (state, savedState, position) => {
  const editor = GetActiveEditor.getActiveEditor()
  // @ts-ignore
  const newState = await EditorWorker.invoke('Hover.loadContent', editor.uid, state, position)
  const commands = await render(state, newState)
  return {
    ...newState,
    commands,
  }
}

export const handleSashPointerDown = async (state, eventX, eventY) => {
  // @ts-ignore
  const newState = await EditorWorker.invoke('Hover.handleSashPointerDown', state, eventX, eventY)
  const commands = await render(state, newState)
  return {
    ...newState,
    commands,
  }
}

export const handleSashPointerMove = async (state, eventX, eventY) => {
  // @ts-ignore
  const newState = await EditorWorker.invoke('Hover.handleSashPointerMove', state, eventX, eventY)
  const commands = await render(state, newState)
  return {
    ...newState,
    commands,
  }
}

export const handleSashPointerUp = (state, eventX, eventY) => {
  return state
}
