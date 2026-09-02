import { expect, test } from '@jest/globals'
import * as SimpleBrowserNewTabPage from '../src/parts/SimpleBrowserNewTabPage/SimpleBrowserNewTabPage.js'

const prefix = 'data:text/html;charset=utf-8,'

const getHtml = (): string => decodeURIComponent(SimpleBrowserNewTabPage.url.slice(prefix.length))

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

test('hides the internal page URL from the address bar', () => {
  expect(SimpleBrowserNewTabPage.toDisplayUrl(SimpleBrowserNewTabPage.url)).toBe('')
  expect(SimpleBrowserNewTabPage.toDisplayUrl('https://example.com')).toBe('https://example.com')
})
