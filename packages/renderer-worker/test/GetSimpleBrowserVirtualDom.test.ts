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
