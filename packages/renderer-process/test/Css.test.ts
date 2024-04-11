/**
 * @jest-environment jsdom
 */
import { beforeEach, beforeAll, expect, jest, test } from '@jest/globals'

beforeAll(() => {
  // @ts-ignore
  globalThis.CSSStyleSheet = class {
    _content: any
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
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/CssState/CssState.ts', () => ({
  get: jest.fn(() => {
    throw new Error('not implemented')
  }),
  set: jest.fn(() => {
    throw new Error(`not implemented`)
  }),
}))

const Css = await import('../src/parts/Css/Css.ts')
const CssState = await import('../src/parts/CssState/CssState.ts')

test('addCssStyleSheet - add', async () => {
  const id = '1'
  const text = '* { font-size: 14px; }'
  // @ts-ignore
  CssState.get.mockImplementation(() => {
    return undefined
  })
  await Css.addCssStyleSheet(id, text)
  expect(document.adoptedStyleSheets).toHaveLength(1)
})

test('addCssStyleSheet - replace', async () => {
  const id = '1'
  const text = '* { font-size: 14px; }'
  const existing = new CSSStyleSheet()
  document.adoptedStyleSheets.push(existing)
  // @ts-ignore
  CssState.get.mockImplementation(() => {
    return existing
  })
  await Css.addCssStyleSheet(id, text)
  expect(document.adoptedStyleSheets).toHaveLength(1)
  expect(document.adoptedStyleSheets[0]).toBe(existing)
})
