import { expect, test } from '@jest/globals'
import * as CrossOriginResourcePolicy from '../src/parts/CrossOriginResourcePolicy/CrossOriginResourcePolicy.js'

test('crossOriginResourcePolicy should be same-origin', () => {
  expect(CrossOriginResourcePolicy.value).toBe('same-origin')
})
