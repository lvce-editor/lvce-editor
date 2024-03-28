import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as NameAnonymousFunction from '../src/parts/NameAnonymousFunction/NameAnonymousFunction.js'

test('nameAnonymousFunction', () => {
  const fn = () => {}
  NameAnonymousFunction.nameAnonymousFunction(fn, 'test')
  expect(fn.name).toBe('test')
})
