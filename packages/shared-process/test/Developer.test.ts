import { beforeEach, expect, jest, test } from '@jest/globals'
import { access } from 'node:fs/promises'

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.js', () => ({
  invoke: jest.fn(),
}))

const Developer = await import('../src/parts/Developer/Developer.js')
const MainProcess = await import('../src/parts/MainProcess/MainProcess.js')

beforeEach(() => {
  jest.clearAllMocks()
})

const exists = async (path: any): Promise<any> => {
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
    getHeapSnapshot(): any {
      return ''
    },
  }))
  // @ts-ignore
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

test('showGpuInfo', async () => {
  await Developer.showGpuInfo()

  expect(MainProcess.invoke).toHaveBeenCalledTimes(1)
  expect(MainProcess.invoke).toHaveBeenCalledWith('ElectronWindowGpuInfo.open')
})
