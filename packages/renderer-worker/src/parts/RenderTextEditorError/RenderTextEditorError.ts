import { EditorErrorInfo } from '../EditorErrorInfo/EditorErrorInfo.ts'
import { EditorErrorInfoAction } from '../EditorErrorInfoAction/EditorErrorInfoAction.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getActionVirtualDom = (action: EditorErrorInfoAction) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Button ButtonPrimary',
      childCount: 1,
    },
    text(action.name),
  ]
}

export const renderTextEditorError = (info: EditorErrorInfo) => {
  const errorString = info.message
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet TextEditorError',
      childCount: 2 + info.actions.length,
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
    ...info.actions.flatMap(getActionVirtualDom),
  ]
}
