import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.ts', () => ({
  invoke: jest.fn(),
}))

const ElectronDeveloper = await import('../src/parts/ElectronDeveloper/ElectronDeveloper.ts')
const MainProcess = await import('../src/parts/MainProcess/MainProcess.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('takeWorkerHeapSnapshot', async () => {
  // @ts-ignore
  MainProcess.invoke.mockResolvedValue('/home/test/Downloads/sample.heapsnapshot')

  await expect(ElectronDeveloper.takeWorkerHeapSnapshot(7, 'Sample Extension Worker')).resolves.toBe(
    '/home/test/Downloads/sample.heapsnapshot',
  )
  expect(MainProcess.invoke).toHaveBeenCalledWith('ElectronDeveloper.takeWorkerHeapSnapshot', 7, 'Sample Extension Worker')
})
