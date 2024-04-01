import * as Id from '../src/parts/Id/Id.ts'
import { test, expect } from '@jest/globals'

test('create', () => {
  const id = Id.create()
  expect(typeof id).toBe('number')
})
