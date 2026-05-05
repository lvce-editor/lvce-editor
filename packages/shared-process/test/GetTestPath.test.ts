import { beforeEach, expect, test } from '@jest/globals'
import { join } from 'node:path'
import * as Root from '../src/parts/Root/Root.js'
import * as GetTestPath from '../src/parts/GetTestPath/GetTestPath.js'

const originalTestPath = process.env.TEST_PATH

beforeEach(() => {
  if (originalTestPath === undefined) {
    delete process.env.TEST_PATH
  } else {
    process.env.TEST_PATH = originalTestPath
  }
})

test('getTestPath - uses absolute TEST_PATH', () => {
  process.env.TEST_PATH = '/home/simon/Documents/levivilet/chat-view/packages/e2e'

  expect(GetTestPath.getTestPath()).toEqual('/home/simon/Documents/levivilet/chat-view/packages/e2e')
})

test('getTestPath - resolves relative TEST_PATH from cwd', () => {
  process.env.TEST_PATH = 'packages/e2e'

  expect(GetTestPath.getTestPath()).toEqual(join(process.cwd(), 'packages/e2e'))
})

test('getTestPath - falls back to extension-host-worker-tests', () => {
  delete process.env.TEST_PATH

  expect(GetTestPath.getTestPath()).toEqual(join(Root.root, 'packages', 'extension-host-worker-tests'))
})