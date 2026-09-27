import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as HtmlInputType from '../HtmlInputType/HtmlInputType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const rowHeight = 56
const overscan = 8
const defaultViewportHeight = 1600
const filteredEntriesCache = new WeakMap()

const getFilteredEntries = (entries, searchValue) => {
  const query = searchValue.trim().toLowerCase()
  const cached = filteredEntriesCache.get(entries)
  if (cached?.query === query) {
    return cached.filteredEntries
  }
  const filteredEntries = []
  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index]
    if (!query || entry.url.toLowerCase().includes(query)) {
      filteredEntries.push({ entry, index })
    }
  }
  filteredEntriesCache.set(entries, { query, filteredEntries })
  return filteredEntries
}

export const getSimpleBrowserHistoryVirtualDom = (entries, searchValue, inputValue = searchValue, scrollTop = 0, viewportHeight = defaultViewportHeight) => {
  const filteredEntries = getFilteredEntries(entries, searchValue)
  const firstVisibleIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
  const lastVisibleIndex = Math.min(filteredEntries.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan)
  const visibleEntries = filteredEntries.slice(firstVisibleIndex, lastVisibleIndex)
  /** @type {any[]} */
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet SimpleBrowserHistory',
      childCount: 1,
      style: { display: 'flex', minHeight: '0', overflow: 'hidden' },
    },
    {
      type: VirtualDomElements.Div,
      className: 'SimpleBrowserHistoryContent',
      childCount: 3,
      style: { display: 'flex', flexDirection: 'column', height: '100%', minHeight: '0' },
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
      value: inputValue,
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
  dom.push({
    type: VirtualDomElements.Div,
    className: 'SimpleBrowserHistoryListViewport',
    tabIndex: 0,
    ariaLabel: 'History entries',
    onScroll: DomEventListenerFunctions.HandleScrollSimpleBrowserHistory,
    childCount: 1,
  })
  if (filteredEntries.length === 0) {
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
  const topPadding = firstVisibleIndex * rowHeight
  const bottomPadding = Math.max(0, (filteredEntries.length - lastVisibleIndex) * rowHeight)
  dom.push({
    type: VirtualDomElements.Ul,
    className: 'SimpleBrowserHistoryList',
    style: { boxSizing: 'border-box', height: `${filteredEntries.length * rowHeight}px`, paddingTop: `${topPadding}px`, paddingBottom: `${bottomPadding}px` },
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
        type: VirtualDomElements.A,
        className: 'SimpleBrowserHistoryUrl',
        href: entry.url,
        'data-url': entry.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: entry.url,
        onClick: DomEventListenerFunctions.HandleClickSimpleBrowserHistoryUrl,
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
