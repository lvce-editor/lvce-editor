import * as RenderTextEditorError from '../RenderTextEditorError/RenderTextEditorError.ts'
import * as GetEditorErrorinfo from '../GetEditorErrorinfo/GetEditorErrorInfo.ts'

export const name = 'TextEditorError'

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
  const info = GetEditorErrorinfo.getEditorErrorInfo(error)
  return RenderTextEditorError.renderTextEditorError(info)
}

export const handleClickCreate = (state) => {
  return state
}
