import { expect, test } from '@jest/globals'
import * as NameAnonymousFunction from '../src/parts/NameAnonymousFunction/NameAnonymousFunction.ts'

test('nameAnonymousFunction', () => {
  const fn = () => {}
  NameAnonymousFunction.nameAnonymousFunction(fn, 'test function')
  expect(fn.name).toBe('test function')
})
