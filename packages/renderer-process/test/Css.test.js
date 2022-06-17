/**
 * @jest-environment jsdom
 */
import * as Css from '../src/parts/Css/Css.js'

beforeEach(() => {
  while (document.head.firstChild) {
    document.head.firstChild.remove()
  }
})

test('setInlineStyle', () => {
  Css.setInlineStyle('ContributedColorTheme', '* { font-size: 14px; }')
  expect(document.head.children.length).toBe(1)
  const $FirstChild = document.head.children[0]
  expect($FirstChild.id).toBe('ContributedColorTheme')
  expect($FirstChild.textContent).toBe('* { font-size: 14px; }')
})

test('setInlineStyle - style sheet already exists', () => {
  Css.setInlineStyle('ContributedColorTheme', '* { font-size: 14px; }')
  Css.setInlineStyle('ContributedColorTheme', '* { font-size: 14px; }')
  expect(document.head.children.length).toBe(1)
})
