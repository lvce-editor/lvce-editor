import { expect, test } from '@jest/globals'
import * as CacheExpiration from '../src/parts/CacheExpiration/CacheExpiration.js'

test('getExpirationDate returns an HTTP date three months in the future', () => {
  const now = Date.UTC(2026, 7, 22, 12, 0, 0)

  expect(CacheExpiration.getExpirationDate(now)).toBe('Fri, 20 Nov 2026 12:00:00 GMT')
})
