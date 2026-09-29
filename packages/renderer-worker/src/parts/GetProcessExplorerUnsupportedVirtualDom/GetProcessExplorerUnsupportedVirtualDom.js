import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getProcessExplorerUnsupportedVirtualDom = (message) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'ProcessExplorer',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ProcessExplorerMessage',
      childCount: 1,
    },
    text(message),
  ]
}
