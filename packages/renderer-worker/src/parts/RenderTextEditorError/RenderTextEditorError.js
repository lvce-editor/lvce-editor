import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const renderTextEditorError = (error) => {
  // TODO
  // 1. render icon
  // 2. render error message
  // 3. render error actions
  const errorString = `${error}`
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
      className: 'TextEditorError',
      childCount: 1,
    },
    text(errorString),
    {
      type: VirtualDomElements.Div,
      className: 'Button',
      childCount: 1,
    },
    text(createFile),
  ]
}
