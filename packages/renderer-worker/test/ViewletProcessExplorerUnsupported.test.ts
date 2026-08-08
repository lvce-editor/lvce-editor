import { expect, test } from '@jest/globals'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'
import * as ViewletProcessExplorerUnsupported from '../src/parts/ViewletProcessExplorerUnsupported/ViewletProcessExplorerUnsupported.ipc.js'

test('renders unsupported message', () => {
  const oldState = ViewletProcessExplorerUnsupported.create(7, 'process-explorer://', 1, 2, 3, 4)
  const newState = ViewletProcessExplorerUnsupported.loadContent(oldState)
  const command = ViewletProcessExplorerUnsupported.render[0].apply(oldState, newState)

  expect(command).toEqual([
    'Viewlet.setDom2',
    [
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
      {
        type: VirtualDomElements.Text,
        text: 'Process Explorer is not supported on web.',
        childCount: 0,
      },
    ],
  ])
})
