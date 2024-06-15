import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const findAllReferences = async (editor: any) => {
  await RendererWorker.invoke('SideBar.show', 'References', /* focus */ true)
  return editor
}
