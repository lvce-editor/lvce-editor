import * as RendererWorker from './QuickPickIpc.js'

export const handleBeforeInput = (event) => {
  event.preventDefault()
  const { target, inputType, data } = event
  const { selectionStart, selectionEnd } = target
  RendererWorker.send(
    /* method */ 'QuickPick.handleBeforeInput',
    /* inputType */ inputType,
    /* data */ data,
    /* selectionStart */ selectionStart,
    /* selectionEnd */ selectionEnd
  )
}
