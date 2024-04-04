/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as Platform from '../src/parts/Platform/Platform.ts'

test('platform', () => {
  expect(typeof Platform.platform).toBe('number')
})
