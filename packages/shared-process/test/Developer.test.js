import { access } from 'node:fs/promises'
import { jest } from '@jest/globals'
import * as Developer from '../src/parts/Developer/Developer.js'

const exists = async (path) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

test.skip('createHeapSnapshot', async () => {
  Date.now = () => 123456
  // TODO jest esm mock not working https://github.com/facebook/jest/issues/10025
  jest.mock('v8', () => ({
    getHeapSnapshot() {
      return ''
    },
  }))
  await Developer.createHeapSnapshot()
  expect(await exists('/tmp/vscode-123456.heapsnapshot')).toBe(true)
})

test('sharedProcessMemoryUsage', () => {
  expect(Developer.sharedProcessMemoryUsage()).toEqual({
    arrayBuffers: expect.any(Number),
    external: expect.any(Number),
    heapTotal: expect.any(Number),
    heapUsed: expect.any(Number),
    rss: expect.any(Number),
  })
})
