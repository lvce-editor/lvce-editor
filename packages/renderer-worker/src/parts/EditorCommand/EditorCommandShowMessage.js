import * as Assert from '../Assert/Assert.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as EditorPosition from './EditorCommandPosition.js'

export const state = {
  timeout: -1,
}

export const editorShowMessage = async (editor, position, message) => {
  Assert.object(editor)
  Assert.object(position)
  Assert.string(message)
  const x = EditorPosition.x(editor, position)
  const y = EditorPosition.y(editor, position)
  const displayErrorMessage = message
  await RendererProcess.invoke(
    /* Viewlet.send */ 3024,
    /* id */ 'EditorText',
    /* method */ 'showOverlayMessage',
    /* x */ x,
    /* y */ y,
    /* content */ displayErrorMessage
  )
  const handleTimeout = () => {
    console.log('ran timeout fn')
    editorHideMessage(editor)
  }

  // TODO use wrapper timing module instead of this
  // @ts-ignore
  state.timeout = setTimeout(handleTimeout, 3_000)
  return editor
}

export const editorHideMessage = async (editor) => {
  clearTimeout(state.timeout)
  state.timeout = -1
  await RendererProcess.invoke(
    /* Viewlet.send */ 3024,
    /* id */ 'EditorText',
    /* method */ 'hideOverlayMessage'
  )
  return editor
}
