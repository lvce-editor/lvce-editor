import { div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getEditorErrorVirtualDom = (message) => {
  return [
    div(
      {
        className: 'EditorErrorContent',
      },
      2
    ),
    div(
      {
        className: 'EditorErrorIcon',
      },
      0
    ),
    div(
      {
        className: 'EditorErrorMessage',
      },
      1
    ),
    text(message),
  ]
}
