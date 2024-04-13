import * as Desktop from '../src/parts/Desktop/Desktop.js'
import { jest, beforeEach, test, expect } from '@jest/globals'

test('getDesktop', () => {
  expect(Desktop.getDesktop()).toEqual(expect.any(String))
})
