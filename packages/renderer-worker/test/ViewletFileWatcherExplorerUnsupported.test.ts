import { expect, test } from '@jest/globals'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'
import * as ViewletFileWatcherExplorerUnsupported from '../src/parts/ViewletFileWatcherExplorerUnsupported/ViewletFileWatcherExplorerUnsupported.ipc.js'

test('renders unsupported message', () => {
  const oldState = ViewletFileWatcherExplorerUnsupported.create(7, 'file-watcher-explorer://', 1, 2, 3, 4)
  const newState = ViewletFileWatcherExplorerUnsupported.loadContent(oldState)
  const command = ViewletFileWatcherExplorerUnsupported.render[0].apply(oldState, newState)

  expect(command).toEqual([
    'Viewlet.setDom2',
    [
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
      {
        type: VirtualDomElements.Text,
        text: 'File Watcher Explorer is not supported on web.',
        childCount: 0,
      },
    ],
  ])
})
