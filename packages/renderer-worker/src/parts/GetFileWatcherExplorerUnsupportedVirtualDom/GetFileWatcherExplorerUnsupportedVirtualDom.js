import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getFileWatcherExplorerUnsupportedVirtualDom = (message) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'FileWatcherExplorer',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'FileWatcherExplorerMessage',
      childCount: 1,
    },
    text(message),
  ]
}
