import { expect, test } from '@jest/globals'
import * as GetSimpleBrowserHistoryVirtualDom from '../src/parts/GetSimpleBrowserHistoryVirtualDom/GetSimpleBrowserHistoryVirtualDom.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

test('renders history placeholder controls', () => {
  expect(GetSimpleBrowserHistoryVirtualDom.getSimpleBrowserHistoryVirtualDom('example')).toEqual([
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet SimpleBrowserHistory',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SimpleBrowserHistoryContent',
      childCount: 2,
    },
    {
      type: VirtualDomElements.H1,
      className: 'SimpleBrowserHistoryHeading',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      text: 'History',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SimpleBrowserHistoryControls',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Input,
      className: 'InputBox SimpleBrowserHistorySearchInput',
      inputType: 'search',
      placeholder: 'Search history',
      ariaLabel: 'Search history',
      onInput: 'handleInput',
      value: 'example',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Button,
      className: 'Button ButtonSecondary',
      onClick: 'clearHistory',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      text: 'Clear history',
      childCount: 0,
    },
  ])
})
