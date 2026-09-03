import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as HtmlInputType from '../HtmlInputType/HtmlInputType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const getVisibleEntries = (entries, searchValue) => {
  const query = searchValue.trim().toLowerCase()
  return entries.map((entry, index) => ({ entry, index })).filter(({ entry }) => !query || entry.url.toLowerCase().includes(query))
}

export const getSimpleBrowserHistoryVirtualDom = (entries, searchValue) => {
  const visibleEntries = getVisibleEntries(entries, searchValue)
  /** @type {any[]} */
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet SimpleBrowserHistory',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SimpleBrowserHistoryContent',
      childCount: 3,
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
      onInput: DomEventListenerFunctions.HandleInputSimpleBrowserHistory,
      value: searchValue,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Button,
      className: 'Button ButtonSecondary',
      onClick: DomEventListenerFunctions.HandleClickSimpleBrowserHistoryClear,
      childCount: 1,
    },
    text('Clear history'),
  ]
  if (visibleEntries.length === 0) {
    dom.push(
      {
        type: VirtualDomElements.P,
        className: 'SimpleBrowserHistoryEmpty',
        childCount: 1,
      },
      text(searchValue ? 'No matching history entries' : 'No history entries'),
    )
    return dom
  }
  dom.push({
    type: VirtualDomElements.Ul,
    className: 'SimpleBrowserHistoryList',
    childCount: visibleEntries.length,
  })
  for (const { entry, index } of visibleEntries) {
    dom.push(
      {
        type: VirtualDomElements.Li,
        className: 'SimpleBrowserHistoryEntry',
        childCount: 3,
      },
      {
        type: VirtualDomElements.Time,
        className: 'SimpleBrowserHistoryDate',
        dateTime: new Date(entry.date).toISOString(),
        childCount: 1,
      },
      text(formatDate(entry.date)),
      {
        type: VirtualDomElements.Span,
        className: 'SimpleBrowserHistoryUrl',
        title: entry.url,
        childCount: 1,
      },
      text(entry.url),
      {
        type: VirtualDomElements.Button,
        className: 'Button ButtonSecondary SimpleBrowserHistoryRemove',
        'data-index': index,
        ariaLabel: `Remove ${entry.url} from history`,
        onClick: DomEventListenerFunctions.HandleClickSimpleBrowserHistoryRemove,
        childCount: 1,
      },
      text('Remove'),
    )
  }
  return dom
}
