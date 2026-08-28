import { expect, test } from '@jest/globals'
import * as GetSimpleBrowserVirtualDom from '../src/parts/GetSimpleBrowserVirtualDom/GetSimpleBrowserVirtualDom.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

test('renders a snapshot below the browser header', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(true, true, false, 'https://example.com', 'data:image/png;base64,c25hcHNob3Q=')

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
      src: 'data:image/png;base64,c25hcHNob3Q=',
      draggable: false,
      childCount: 0,
    },
  ])
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

test('renders accessible search suggestions above an undimmed snapshot', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(
    true,
    true,
    false,
    'what is',
    'data:image/png;base64,c25hcHNob3Q=',
    ['what is', 'what is my ip'],
    1,
  )

  expect(dom[0].childCount).toBe(4)
  expect(dom).toContainEqual({
    type: VirtualDomElements.Img,
    className: 'SimpleBrowserSnapshot SimpleBrowserSnapshotSearchSuggestions',
    src: 'data:image/png;base64,c25hcHNob3Q=',
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

test('renders selectable tabs with favicon, title, close, and new tab controls', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, '', '', [], -1, [
    { favicon: 'https://example.com/favicon.png', title: 'Example' },
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
  expect(dom).toContainEqual(expect.objectContaining({ className: 'SimpleBrowserTabClose', onClick: 'handleClickSimpleBrowserTabClose' }))
  expect(dom).toContainEqual(expect.objectContaining({ className: 'SimpleBrowserNewTab', onClick: 'handleClickSimpleBrowserNewTab' }))
})

test('omits the tab strip when tabs are disabled', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(false, false, false, '', '', [], -1, [], 0, false)

  expect(dom[0].childCount).toBe(1)
  expect(dom).not.toContainEqual(expect.objectContaining({ className: 'SimpleBrowserTabs' }))
})
