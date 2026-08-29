import * as HtmlInputType from '../HtmlInputType/HtmlInputType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getSimpleBrowserHistoryVirtualDom = (searchValue) => {
  return [
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
    text('History'),
    {
      type: VirtualDomElements.Div,
      className: 'SimpleBrowserHistoryControls',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Input,
      className: 'InputBox SimpleBrowserHistorySearchInput',
      inputType: HtmlInputType.Search,
      placeholder: 'Search history',
      ariaLabel: 'Search history',
      onInput: 'handleInput',
      value: searchValue,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Button,
      className: 'Button ButtonSecondary',
      onClick: 'clearHistory',
      childCount: 1,
    },
    text('Clear history'),
  ]
}
