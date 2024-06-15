import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const FindWidget = 'FindWidget'

export const openFind = async (state: any) => {
  await RendererWorker.invoke('Viewlet.openWidget', FindWidget)
  return state
}
