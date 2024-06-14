import * as Assert from '../Assert/Assert.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
// @ts-ignore
// import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

export const state = {
  timeout: -1,
}

/**
 *
 * @param {any} editor
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @param {string} message
 * @param {boolean} isError
 * @returns
 */
// @ts-ignore
export const editorShowMessage = async (editor, rowIndex, columnIndex, message, isError) => {
  Assert.object(editor)
  Assert.number(rowIndex)
  Assert.number(columnIndex)
  Assert.string(message)
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex)
  const displayErrorMessage = message
  await RendererWorker.invoke('Editor.showOverlayMessage', editor.uid, 'showOverlayMessage', x, y, displayErrorMessage)

  if (!isError) {
    const handleTimeout = () => {
      editorHideMessage(editor)
    }

    // TODO use wrapper timing module instead of this
    // @ts-ignore
    state.timeout = setTimeout(handleTimeout, 3_000)
  }
  return editor
}

/**
 *
 * @param {any} editor
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @param {string} message
 * @returns
 */
// @ts-ignore
export const showErrorMessage = (editor, rowIndex, columnIndex, message) => {
  return editorShowMessage(editor, rowIndex, columnIndex, message, /* isError */ true)
}

// @ts-ignore
export const editorHideMessage = async (editor) => {
  clearTimeout(state.timeout)
  state.timeout = -1
  // await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ editor.uid, /* method */ 'hideOverlayMessage')
  return editor
}
