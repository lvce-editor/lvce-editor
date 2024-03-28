import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as Id from '../src/parts/Id/Id.js'

test('generate', () => {
  expect(Id.create()).toBe(1)
  expect(Id.create()).toBe(2)
})
