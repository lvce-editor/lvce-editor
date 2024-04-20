import * as Main from '../src/parts/Main/Main.js'
import { test, expect } from '@jest/globals'

test('main', () => {
  expect(typeof Main.main).toBe('function')
})
