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
      onClick: 'handleClickSimpleBrowserTab',
      onContextMenu: 'handleContextMenuSimpleBrowserTab',
      role: 'tab',
    }),
  )
  expect(dom).toContainEqual(
    expect.objectContaining({ className: 'SimpleBrowserTabFavicon', crossOrigin: 'anonymous', src: 'https://example.com/favicon.png' }),
  )
  expect(dom).toContainEqual(
    expect.objectContaining({
      ariaLabel: 'Mute tab',
      ariaPressed: false,
      className: 'SimpleBrowserTabAudio',
      'data-index': 0,
      onClick: 'handleClickSimpleBrowserTabAudio',
      title: 'Mute tab',
      type: VirtualDomElements.Button,
    }),
  )
  expect(dom).toContainEqual(expect.objectContaining({ className: 'MaskIcon MaskIconUnmute' }))
  expect(dom).toContainEqual(expect.objectContaining({ className: 'SimpleBrowserTabClose', onClick: 'handleClickSimpleBrowserTabClose' }))
  expect(dom).toContainEqual(expect.objectContaining({ className: 'SimpleBrowserNewTab', onClick: 'handleClickSimpleBrowserNewTab' }))
})

test('omits the audio icon for a silent tab', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, '', '', [], -1, [
    { favicon: '', isAudioPlaying: false, title: 'Example' },
  ])

  expect(dom).not.toContainEqual(expect.objectContaining({ className: 'SimpleBrowserTabAudio' }))
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
