import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const WhenExpressionEditorText = 12

export const handleFocus = (editor: any) => {
  // TODO make change events functional,
  // when rendering, send focus changes to renderer worker
  RendererWorker.invoke('Focus.setFocus', WhenExpressionEditorText)
  return editor
}
