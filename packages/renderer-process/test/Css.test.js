/**
 * @jest-environment jsdom
 */
import * as Css from '../src/parts/Css/Css.js'

beforeEach(() => {
  while (document.head.firstChild) {
    document.head.firstChild.remove()
  }
  document.adoptedStyleSheets = []

  globalThis.fetch = async () => {
    throw new Error('not implemented')
  }
})

beforeAll(() => {
  // @ts-ignore
  globalThis.Response = class {
    constructor(input) {
      this.ok = input.ok
      this._text = input.text
      this.statusText = input.statusText
    }
    text() {
      return this._text
    }
  }
  // @ts-ignore
  globalThis.CSSStyleSheet = class {
    constructor() {}

    replace(content) {
      this._content = content
    }
  }
})

test('setInlineStyle', () => {
  Css.setInlineStyle('ContributedColorTheme', '* { font-size: 14px; }')
  expect(document.head.children).toHaveLength(1)
  const $FirstChild = document.head.children[0]
  expect($FirstChild.id).toBe('ContributedColorTheme')
  expect($FirstChild.textContent).toBe('* { font-size: 14px; }')
})

test('setInlineStyle - style sheet already exists', () => {
  Css.setInlineStyle('ContributedColorTheme', '* { font-size: 14px; }')
  Css.setInlineStyle('ContributedColorTheme', '* { font-size: 14px; }')
  expect(document.head.children).toHaveLength(1)
})

test('loadCssStyleSheet', async () => {
  globalThis.fetch = async () => {
    return new Response({
      ok: true,
      statusText: 'ok',
      // @ts-ignore
      text: 'h1 { font-size: 20px; }',
    })
  }
  await Css.loadCssStyleSheet('/test/Component.css')
  expect(document.adoptedStyleSheets).toHaveLength(1)
})

test('loadCssStyleSheet - error - 404', async () => {
  // @ts-ignore
  globalThis.fetch = () => {
    // @ts-ignore
    return new Response({ ok: false, statusText: 'Not Found' })
  }
  await expect(
    Css.loadCssStyleSheet('/test/Component.css')
  ).rejects.toThrowError(new Error('Not Found'))
})
