/**
 * @jest-environment jsdom
 */
import * as Platform from '../src/parts/Platform/Platform.js'
import { beforeEach, test, expect } from '@jest/globals'

test('platform', () => {
  expect(typeof Platform.platform).toBe('number')
})
