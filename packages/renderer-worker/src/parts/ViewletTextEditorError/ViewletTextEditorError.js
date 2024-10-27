import * as RenderTextEditorError from '../RenderTextEditorError/RenderTextEditorError.js'

export const name = 'TextEditorError'

export const Css = ['']

export const create = () => {
  return {
    id: 0,
    error: undefined,
  }
}

export const loadContent = (state) => {
  // TODO
  return state
}

export const render = (error) => {
  return RenderTextEditorError.renderTextEditorError(error)
}

export const handleClickCreate = (state) => {
  return state
}
