/**
 * @jest-environment jsdom
 */
import * as WindowTitle from '../src/parts/WindowTitle/WindowTitle.js'
import { beforeEach, test, expect } from '@jest/globals'

test('setTitle', () => {
  WindowTitle.set('test')
  expect(document.title).toBe('test')
})
