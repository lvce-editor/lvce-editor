import * as Assert from '../Assert/Assert.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as EditorPosition from './ViewletEditorPosition.js/index.js'

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
export const editorShowMessage = async (
  editor,
  rowIndex,
  columnIndex,
  message,
  isError
) => {
  Assert.object(editor)
  Assert.number(rowIndex)
  Assert.number(columnIndex)
  Assert.string(message)
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  const displayErrorMessage = message
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'EditorText',
    /* method */ 'showOverlayMessage',
    /* x */ x,
    /* y */ y,
    /* content */ displayErrorMessage
  )

  if (!isError) {
    const handleTimeout = () => {
      console.log('ran timeout fn')
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
export const showErrorMessage = (editor, rowIndex, columnIndex, message) => {
  return editorShowMessage(
    editor,
    rowIndex,
    columnIndex,
    message,
    /* isError */ true
  )
}

export const editorHideMessage = async (editor) => {
  clearTimeout(state.timeout)
  state.timeout = -1
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'EditorText',
    /* method */ 'hideOverlayMessage'
  )
  return editor
}
