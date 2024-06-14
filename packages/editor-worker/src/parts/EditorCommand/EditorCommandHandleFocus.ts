import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const WhenExpressionEditorText = 12

export const handleFocus = async (editor: any) => {
  await RendererWorker.invoke('Focus.setFocus', WhenExpressionEditorText)
  return editor
}
