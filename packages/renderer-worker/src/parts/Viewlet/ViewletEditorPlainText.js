import * as FileSystem from '../FileSystem/FileSystem.js'

export const name = 'PlainText'

export const create = (id, uri, left, top, width, height) => {
  return {
    content: 'abc',
    uri,
    disposed: false,
  }
}

export const loadContent = async (state) => {
  const content = await FileSystem.readFile(state.uri)
  return {
    ...state,
    content,
  }
}

export const contentLoaded = async (state) => {}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  const changes = []
  if (oldState.content !== newState.content) {
    changes.push([
      /* Viewlet.invoke */ 3024,
      /* id */ 'EditorPlainText',
      /* method */ 'setContent',
      /* content */ newState.content,
    ])
  }
  return changes
}
