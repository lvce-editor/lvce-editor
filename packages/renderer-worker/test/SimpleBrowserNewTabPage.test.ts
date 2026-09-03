import { expect, test } from '@jest/globals'
import * as SimpleBrowserNewTabPage from '../src/parts/SimpleBrowserNewTabPage/SimpleBrowserNewTabPage.js'

const prefix = 'data:text/html;charset=utf-8,'

const getHtml = (url: string = SimpleBrowserNewTabPage.url): string => decodeURIComponent(url.slice(prefix.length))

test('provides a self-contained new tab page', () => {
  expect(SimpleBrowserNewTabPage.url.startsWith(prefix)).toBe(true)
  expect(getHtml()).toContain('<title>New Tab</title>')
  expect(getHtml()).toContain('<span>LVCE</span>')
  expect(getHtml()).toContain('role="search"')
  expect(getHtml()).toContain('action="https://www.google.com/search"')
  expect(getHtml()).toContain('name="q"')
  expect(getHtml()).toContain('aria-label="Search with Google"')
  expect(getHtml()).toContain('user-select: none;')
})

test('uses workbench theme colors', () => {
  const url = SimpleBrowserNewTabPage.getUrl(`:root {
    --EditorBackground: #193549;
    --WorkbenchForeground: #c5c5c5;
    --InputBoxBackground: #15232d;
    --InputBoxForeground: #ffc600;
    --InputBoxPlaceholderForeground: #aaaaaa;
    --InputBoxBorder: #0d3a58;
    --FocusOutline: #0088ff;
    --WidgetBackground: #122738;
  }`)
  const html = getHtml(url)

  expect(html).toContain('--EditorBackground: #193549;')
  expect(html).toContain('--InputBoxBackground: #15232d;')
  expect(html).toContain('--InputBoxForeground: #ffc600;')
  expect(html).toContain('--FocusOutline: #0088ff;')
  expect(html).toContain('background: var(--EditorBackground);')
})

test('falls back from the legacy empty EditorBackGround color to MainBackground', () => {
  const url = SimpleBrowserNewTabPage.getUrl(`:root {
    --EditorBackGround: ;
    --MainBackground: #193549;
  }`)

  expect(getHtml(url)).toContain('--EditorBackground: #193549;')
})

test('hides the internal page URL from the address bar', () => {
  expect(SimpleBrowserNewTabPage.toDisplayUrl(SimpleBrowserNewTabPage.url)).toBe('')
  expect(SimpleBrowserNewTabPage.toDisplayUrl(SimpleBrowserNewTabPage.getUrl(':root { --EditorBackground: #193549; }'))).toBe('')
  expect(SimpleBrowserNewTabPage.toDisplayUrl('https://example.com')).toBe('https://example.com')
})
