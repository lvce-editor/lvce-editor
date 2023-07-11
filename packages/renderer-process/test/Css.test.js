/**
 * @jest-environment jsdom
 */
import * as Css from '../src/parts/Css/Css.js'

beforeAll(() => {
  // @ts-ignore
  globalThis.CSSStyleSheet = class {
    constructor() {}

    replace(content) {
      this._content = content
    }
  }
})

beforeEach(() => {
  while (document.head.firstChild) {
    document.head.firstChild.remove()
  }
  document.adoptedStyleSheets = []
})

test('addCssStyleSheet', async () => {
  await Css.addCssStyleSheet('* { font-size: 14px; }')
  expect(document.adoptedStyleSheets).toHaveLength(1)
})
