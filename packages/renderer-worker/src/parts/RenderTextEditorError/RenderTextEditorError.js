import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const renderTextEditorError = (info) => {
  const errorString = info.message
  const createFile = `Create File`
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet TextEditorError',
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: `EditorTextIcon EditorTextIconError MaskIcon MaskIconError`,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'TextEditorErrorMessage',
      childCount: 1,
    },
    text(errorString),
    {
      type: VirtualDomElements.Div,
      className: 'Button ButtonPrimary',
      childCount: 1,
    },
    text(createFile),
  ]
}