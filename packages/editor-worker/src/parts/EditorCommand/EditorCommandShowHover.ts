import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const EditorHover = 'EditorHover'

export const showHover = async (state: any) => {
  await RendererWorker.invoke('Viewlet.openWidget', EditorHover)
  return state
}
