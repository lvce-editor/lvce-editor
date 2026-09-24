import { expect, test } from '@jest/globals'
import * as GetSimpleBrowserVirtualDom from '../src/parts/GetSimpleBrowserVirtualDom/GetSimpleBrowserVirtualDom.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

test('renders a snapshot below the browser header', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(true, true, false, 'https://example.com', 'blob:https://example.com/snapshot')

  expect(dom[0].childCount).toBe(3)
  expect(dom.slice(-2)).toEqual([
    {
      type: VirtualDomElements.Div,
      className: 'SimpleBrowserSnapshotWrapper',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Img,
      className: 'SimpleBrowserSnapshot',
      src: 'blob:https://example.com/snapshot',
      draggable: false,
      childCount: 0,
    },
  ])
})

test('renders history as an interactive browser tab page', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(
    false,
    false,
    false,
    'simple-browser-history://',
    '',
    [],
    -1,
    [{ iframeSrc: 'simple-browser-history://', title: 'History' }],
    0,
    true,
    true,
    [],
    undefined,
    -1,
    false,
    'light',
    undefined,
    true,
    [{ date: Date.UTC(2026, 8, 3, 12, 30), url: 'https://newer.example/docs' }],
    '',
  )

  expect(dom).toContainEqual(expect.objectContaining({ className: expect.stringContaining('SimpleBrowserHistory') }))
  expect(dom).toContainEqual(expect.objectContaining({ className: expect.stringContaining('SimpleBrowserHistorySearchInput') }))
  expect(dom).toContainEqual(expect.objectContaining({ onClick: 'handleClickSimpleBrowserHistoryClear' }))
  expect(dom).toContainEqual(expect.objectContaining({ onClick: 'handleClickSimpleBrowserHistoryRemove' }))
})

test('renders a cached page snapshot through the virtual dom', () => {
  const pageSnapshotDom = [
    {
      type: VirtualDomElements.Article,
      className: 'article',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      text: 'Cached page',
      childCount: 0,
    },
  ]
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(
    false,
    false,
    true,
    'https://example.com',
    '',
    [],
    -1,
    [],
    0,
    true,
    true,
    pageSnapshotDom,
  )

  expect(dom).toContainEqual({
    type: VirtualDomElements.Div,
    className: 'SimpleBrowserPreview',
    ariaHidden: true,
    inert: true,
    childCount: 1,
  })
  expect(dom.slice(-2)).toEqual(pageSnapshotDom)
})

test('names the address input so focus can be restored after rendering', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, 'what is')

  expect(dom).toContainEqual(
    expect.objectContaining({
      name: 'simple-browser-address',
      type: VirtualDomElements.Input,
    }),
  )
})

test('renders the empty tab landing page in the view dom', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(
    false,
    false,
    false,
    '',
    '',
    [],
    -1,
    [{ browserViewId: 0, iframeSrc: '', title: 'New Tab' }],
    0,
  )

  expect(dom).toContainEqual(expect.objectContaining({ className: 'SimpleBrowserNewTabPage', type: VirtualDomElements.Main }))
  expect(dom).toContainEqual(expect.objectContaining({ className: 'SimpleBrowserNewTabBrand' }))
  expect(dom).toContainEqual(
    expect.objectContaining({
      ariaLabel: 'Search with Google',
      className: 'SimpleBrowserNewTabSearchInput',
      name: 'simple-browser-new-tab-search',
      type: VirtualDomElements.Input,
    }),
  )
})

test('disables unavailable navigation buttons', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, true, false, 'https://example.com')

  expect(dom.find((node) => node.title === 'Back')).toMatchObject({ disabled: true })
  expect(dom.find((node) => node.title === 'Forward')).toMatchObject({ disabled: false })
})

test('tracks focus anywhere in the simple browser chrome', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, '')

  expect(dom[0]).toMatchObject({ onFocusIn: 'handleFocusInSimpleBrowser' })
})

test('renders accessible search suggestions above an undimmed snapshot', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(
    true,
    true,
    false,
    'what is',
    'blob:https://example.com/snapshot',
    ['what is', 'what is my ip'],
    1,
  )

  expect(dom[0].childCount).toBe(4)
  expect(dom).toContainEqual({
    type: VirtualDomElements.Img,
    className: 'SimpleBrowserSnapshot SimpleBrowserSnapshotSearchSuggestions',
    src: 'blob:https://example.com/snapshot',
    draggable: false,
    childCount: 0,
  })
  expect(dom).toContainEqual(
    expect.objectContaining({
      className: 'SimpleBrowserSuggestion SimpleBrowserSuggestionSelected',
      role: 'option',
      ariaSelected: true,
      'data-value': 'what is my ip',
      onClick: 'handleClickSuggestion',
    }),
  )
})

test('renders the first matching suggestion inline without changing the input value', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, 'cheese', '', [
    { favicon: '', type: 'history', value: 'cheeseburger' },
  ])

  expect(dom).toContainEqual(
    expect.objectContaining({
      ariaHidden: true,
      className: 'SimpleBrowserInlineSuggestion',
      'data-value': 'cheeseburger',
    }),
  )
  expect(dom).toContainEqual(expect.objectContaining({ className: 'SimpleBrowserInlineSuggestionSuffix' }))
  const input = dom.find((node) => node.name === 'simple-browser-address')
  expect(input).toBeDefined()
  expect(input).not.toHaveProperty('value')
  expect(dom).toContainEqual(expect.objectContaining({ text: 'burger' }))
})

test('does not render an inline suggestion for an exact match', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, 'cheese', '', [
    { favicon: '', type: 'search', value: 'cheese' },
  ])

  expect(dom).not.toContainEqual(expect.objectContaining({ className: 'SimpleBrowserInlineSuggestion' }))
})

test('renders the stored favicon for a URL suggestion', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, 'soundcloud', '', [
    {
      favicon: 'https://soundcloud.com/favicon.ico',
      type: 'url',
      value: 'https://soundcloud.com',
    },
  ])

  expect(dom).toContainEqual(
    expect.objectContaining({
      className: 'SimpleBrowserSuggestionFavicon',
      crossOrigin: 'anonymous',
      src: 'https://soundcloud.com/favicon.ico',
      type: VirtualDomElements.Img,
    }),
  )
  expect(dom).toContainEqual(expect.objectContaining({ 'data-value': 'https://soundcloud.com' }))
})

test('renders selectable tabs with favicon, title, close, and new tab controls', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, '', '', [], -1, [
    { favicon: 'https://example.com/favicon.png', isAudioPlaying: true, title: 'Example' },
  ])

  expect(dom).toContainEqual(
    expect.objectContaining({
      className: 'SimpleBrowserTab SimpleBrowserTabSelected',
      onPointerDown: 'handlePointerDownSimpleBrowserTab',
      onContextMenu: 'handleContextMenuSimpleBrowserTab',
      role: 'tab',
    }),
  )
  const tabIndex = dom.findIndex((node) => node.className === 'SimpleBrowserTab SimpleBrowserTabSelected')
  expect(dom.slice(tabIndex, tabIndex + 6)).toEqual([
    expect.objectContaining({ className: 'SimpleBrowserTab SimpleBrowserTabSelected', childCount: 4 }),
    { type: VirtualDomElements.Div, className: 'SimpleBrowserTabFaviconWrapper', childCount: 1 },
    {
      type: VirtualDomElements.Img,
      className: 'SimpleBrowserTabFavicon',
      alt: '',
      'data-index': 0,
      onError: 'HandleErrorSimpleBrowserFavicon',
      crossOrigin: 'anonymous',
      src: 'https://example.com/favicon.png',
      draggable: false,
      childCount: 0,
    },
    { type: VirtualDomElements.Span, className: 'SimpleBrowserTabTitle', childCount: 1 },
    { type: VirtualDomElements.Text, text: 'Example', childCount: 0 },
    expect.objectContaining({ className: 'SimpleBrowserTabAudio' }),
  ])
  expect(dom).toContainEqual(
    expect.objectContaining({
      ariaLabel: 'Mute tab',
      ariaPressed: false,
      className: 'SimpleBrowserTabAudio',
      'data-index': 0,
      onClick: 'handleClickSimpleBrowserTabAudio',
      onPointerDown: 'handlePointerDownSimpleBrowserTabAction',
      title: 'Mute tab',
      type: VirtualDomElements.Button,
    }),
  )
  expect(dom).toContainEqual(expect.objectContaining({ className: 'MaskIcon MaskIconUnmute' }))
  expect(dom).toContainEqual(
    expect.objectContaining({
      className: 'SimpleBrowserTabClose',
      onClick: 'handleClickSimpleBrowserTabClose',
      onPointerDown: 'handlePointerDownSimpleBrowserTabAction',
    }),
  )
  expect(dom).toContainEqual(expect.objectContaining({ className: 'SimpleBrowserNewTab', onClick: 'handleClickSimpleBrowserNewTab' }))
})

test('renders a history icon for history tabs without changing website favicons', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, '', '', [], -1, [
    { favicon: 'https://example.com/favicon.png', iframeSrc: 'https://example.com', title: 'Example' },
    { favicon: '', iframeSrc: 'simple-browser-history://', title: 'History' },
  ], 1)

  const historyTabIndex = dom.findIndex((node) => node.className === 'SimpleBrowserTab SimpleBrowserTabSelected')
  expect(dom.slice(historyTabIndex, historyTabIndex + 5)).toEqual([
    expect.objectContaining({ className: 'SimpleBrowserTab SimpleBrowserTabSelected', childCount: 3 }),
    { type: VirtualDomElements.Div, className: 'SimpleBrowserTabFaviconWrapper', childCount: 1 },
    {
      type: VirtualDomElements.Span,
      className: 'SimpleBrowserTabFavicon SimpleBrowserTabHistoryFavicon',
      ariaHidden: true,
      childCount: 0,
    },
    { type: VirtualDomElements.Span, className: 'SimpleBrowserTabTitle', childCount: 1 },
    { type: VirtualDomElements.Text, text: 'History', childCount: 0 },
  ])
  expect(dom).toContainEqual(expect.objectContaining({ src: 'https://example.com/favicon.png' }))
  expect(dom).not.toContainEqual(expect.objectContaining({ className: 'SimpleBrowserTabFavicon SimpleBrowserTabFaviconFallback' }))
})

test('freezes tab sizing through the tab list style', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(
    false,
    false,
    false,
    '',
    '',
    [],
    -1,
    [{ favicon: '', title: 'Example' }],
    0,
    true,
    true,
    [],
    undefined,
    -1,
    false,
    'light',
    { tabWidth: 150 },
  )

  expect(dom.find((node) => node.role === 'tablist')).toMatchObject({
    className: 'SimpleBrowserTabs SimpleBrowserTabsFrozen',
    onPointerOut: 'handlePointerOutSimpleBrowserTabs',
    onPointerOver: 'handlePointerOverSimpleBrowserTabs',
    style: '--SimpleBrowserTabWidth: 150px;',
  })
})

test('omits the audio icon for a silent tab', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, '', '', [], -1, [
    { favicon: '', isAudioPlaying: false, title: 'Example' },
  ])

  expect(dom).not.toContainEqual(expect.objectContaining({ className: 'SimpleBrowserTabAudio' }))
})

test('wraps the fallback favicon in the same fixed-size container', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, '', '', [], -1, [{ favicon: '', title: 'Example' }])

  const tabIndex = dom.findIndex((node) => node.className === 'SimpleBrowserTab SimpleBrowserTabSelected')
  expect(dom.slice(tabIndex, tabIndex + 5)).toEqual([
    expect.objectContaining({ className: 'SimpleBrowserTab SimpleBrowserTabSelected', childCount: 3 }),
    { type: VirtualDomElements.Div, className: 'SimpleBrowserTabFaviconWrapper', childCount: 1 },
    { type: VirtualDomElements.Span, className: 'SimpleBrowserTabFavicon SimpleBrowserTabFaviconFallback', ariaHidden: true, childCount: 1 },
    { type: VirtualDomElements.Text, text: '◉', childCount: 0 },
    { type: VirtualDomElements.Span, className: 'SimpleBrowserTabTitle', childCount: 1 },
  ])
})

test('renders a muted audio button for a muted tab', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, '', '', [], -1, [
    { favicon: '', isAudioPlaying: false, muted: true, title: 'Example' },
  ])

  expect(dom).toContainEqual(
    expect.objectContaining({
      ariaLabel: 'Unmute tab',
      ariaPressed: true,
      className: 'SimpleBrowserTabAudio',
      'data-index': 0,
      onClick: 'handleClickSimpleBrowserTabAudio',
      onPointerDown: 'handlePointerDownSimpleBrowserTabAction',
      title: 'Unmute tab',
      type: VirtualDomElements.Button,
    }),
  )
  expect(dom).toContainEqual(expect.objectContaining({ className: 'MaskIcon MaskIconMute' }))
})

test('omits the audio icon when the audio indicator is disabled', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(
    false,
    false,
    false,
    '',
    '',
    [],
    -1,
    [{ favicon: '', isAudioPlaying: true, title: 'Example' }],
    0,
    true,
    false,
  )

  expect(dom).not.toContainEqual(expect.objectContaining({ className: 'SimpleBrowserTabAudio' }))
})

test('omits the muted audio icon when the audio indicator is disabled', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(
    false,
    false,
    false,
    '',
    '',
    [],
    -1,
    [{ favicon: '', isAudioPlaying: false, muted: true, title: 'Example' }],
    0,
    true,
    false,
  )

  expect(dom).not.toContainEqual(expect.objectContaining({ className: 'SimpleBrowserTabAudio' }))
})

test('omits the tab strip when tabs are disabled', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, '', '', [], -1, [], 0, false)

  expect(dom[0].childCount).toBe(1)
  expect(dom).not.toContainEqual(expect.objectContaining({ className: 'SimpleBrowserTabs' }))
})

test('renders the rich tab hover with the full title and memory usage', () => {
  const tabHover = {
    index: 0,
    left: 24,
    statusLabel: 'Memory usage: 42 MB',
    title: 'A complete page title',
  }
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(
    false,
    false,
    false,
    '',
    'blob:https://example.com/snapshot',
    [],
    -1,
    [{ favicon: '', title: 'Example' }],
    0,
    true,
    true,
    [],
    tabHover,
  )

  expect(dom).toContainEqual(
    expect.objectContaining({
      ariaDescribedBy: 'SimpleBrowserTabHover',
      ariaLabel: 'Example',
      className: 'SimpleBrowserTab SimpleBrowserTabSelected',
      onPointerOut: 'handlePointerOutSimpleBrowserTab',
      onPointerOver: 'handlePointerOverSimpleBrowserTab',
    }),
  )
  expect(dom).toContainEqual(
    expect.objectContaining({
      className: 'SimpleBrowserTabHover',
      id: 'SimpleBrowserTabHover',
      left: 24,
      role: 'tooltip',
    }),
  )
  expect(dom).toContainEqual(expect.objectContaining({ text: 'A complete page title' }))
  expect(dom).toContainEqual(expect.objectContaining({ className: 'SimpleBrowserTabHoverStatus' }))
  expect(dom).toContainEqual(expect.objectContaining({ text: 'Memory usage: 42 MB' }))
})

test('renders an accessible browser menu button', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, 'https://example.com')

  expect(dom).toContainEqual(
    expect.objectContaining({
      ariaLabel: 'Customize and control Simple Browser',
      className: 'IconButton SimpleBrowserMenuButton',
      onClick: 'handleClickSimpleBrowserMenu',
      title: 'Customize and control Simple Browser',
    }),
  )
})

test('browser tabs expose native drag events and drop targets', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, '', '', [], -1, [
    { browserViewId: 1, title: 'One' },
    { browserViewId: 2, title: 'Two' },
  ])
  const tabs = dom.filter((node) => node.role === 'tab')
  expect(tabs).toHaveLength(2)
  expect(tabs[0]).toMatchObject({ draggable: true, onDragStart: 'handleDragStartSimpleBrowserTab', onDragOver: 'handleDragOverSimpleBrowserTab' })
  expect(dom.find((node) => node.role === 'tablist')).toMatchObject({ onDrop: 'handleDropSimpleBrowserTab' })
})
