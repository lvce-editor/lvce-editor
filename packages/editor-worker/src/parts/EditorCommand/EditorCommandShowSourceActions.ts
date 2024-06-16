import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const EditorSourceActions = 'EditorSourceActions'

export const showSourceActions = async (editor: any) => {
  // TODO
  // 1. hide hover, completions, color picker
  // 2. query source actions from extension host
  // 3. show source actions menu

  await RendererWorker.invoke('Viewlet.openWidget', EditorSourceActions)
  return editor
}
