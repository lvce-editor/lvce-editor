/**
 * @jest-environment jsdom
 */
import * as Window from '../src/parts/Window/Window.js'

test('setTitle', () => {
  Window.setTitle('test')
  expect(document.title).toBe('test')
})
