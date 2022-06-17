/**
 * @jest-environment jsdom
 */
import * as Platform from '../src/parts/Platform/Platform.js'

test('platform', () => {
  expect(typeof Platform.platform).toBe('string')
})
