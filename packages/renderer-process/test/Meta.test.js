/**
 * @jest-environment jsdom
 */
import * as Meta from '../src/parts/Meta/Meta.js'

beforeEach(() => {
  while (document.head.firstChild) {
    document.head.firstChild.remove()
  }
})

test("setThemeColor - meta element doesn't exist", () => {
  const meta = document.createElement('meta')
  meta.name = 'theme-color'
  document.head.append(meta)
  Meta.setThemeColor('#ffffff')
  expect(meta.content).toBe('#ffffff')
})

test("setThemeColor - meta element doesn't exist", () => {
  Meta.setThemeColor('#ffffff')
  expect(document.querySelectorAll('meta')).toHaveLength(0)
})
