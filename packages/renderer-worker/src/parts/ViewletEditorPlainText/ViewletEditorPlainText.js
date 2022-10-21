import * as FileSystem from '../FileSystem/FileSystem.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const name = ViewletModuleId.EditorPlainText

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

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const hasFunctionalRender = true

const renderContent = {
  isEqual(oldState, newState) {
    return oldState.content === newState.content
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'EditorPlainText',
      /* method */ 'setContent',
      /* content */ newState.content,
    ]
  },
}

export const render = [renderContent]
