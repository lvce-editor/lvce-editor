import { expect, test } from '@jest/globals'
import * as GetSimpleBrowserVirtualDom from '../src/parts/GetSimpleBrowserVirtualDom/GetSimpleBrowserVirtualDom.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

test('renders a snapshot below the browser header', () => {
  const dom = GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(true, true, false, 'https://example.com', 'data:image/png;base64,c25hcHNob3Q=')

  expect(dom[0].childCount).toBe(2)
  expect(dom.at(-1)).toEqual({
    type: VirtualDomElements.Img,
    className: 'SimpleBrowserSnapshot',
    src: 'data:image/png;base64,c25hcHNob3Q=',
    draggable: false,
    childCount: 0,
  })
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

  expect(dom[0].childCount).toBe(3)
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
