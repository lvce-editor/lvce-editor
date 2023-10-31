/**
 * @jest-environment jsdom
 */
import * as WindowTitle from '../src/parts/WindowTitle/WindowTitle.js'

test('setTitle', () => {
  WindowTitle.set('test')
  expect(document.title).toBe('test')
})
