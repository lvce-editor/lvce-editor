/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as WindowTitle from '../src/parts/WindowTitle/WindowTitle.ts'

test('setTitle', () => {
  WindowTitle.set('test')
  expect(document.title).toBe('test')
})
