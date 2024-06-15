import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const closeCompletion = async (editor: any) => {
  // TODO
  const completionUid = editor.completionUid
  await RendererWorker.invoke('Viewlet.dispose', completionUid)
  editor.completionUid = 0
  return editor
}
