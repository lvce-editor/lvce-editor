import * as NameAnonymousFunction from '../src/parts/NameAnonymousFunction/NameAnonymousFunction.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('nameAnonymousFunction', () => {
  const fn = () => {}
  NameAnonymousFunction.nameAnonymousFunction(fn, 'test')
  expect(fn.name).toBe('test')
})
