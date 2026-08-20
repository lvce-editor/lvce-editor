import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Copy/Copy.ts', () => ({
  copyFile: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Replace/Replace.ts', () => ({
  replace: jest.fn(),
}))

const Copy = await import('../src/parts/Copy/Copy.ts')
const CopySharedProcessWorkerManifest = await import('../src/parts/CopySharedProcessWorkerManifest/CopySharedProcessWorkerManifest.ts')
const Replace = await import('../src/parts/Replace/Replace.ts')

test('copies the worker manifest and makes the linked-worker import package-local', async () => {
  await CopySharedProcessWorkerManifest.copySharedProcessWorkerManifest('/tmp/shared-process')

  expect(Copy.copyFile).toHaveBeenCalledWith({
    from: 'packages/renderer-worker/src/parts/Workers/Workers.json',
    to: '/tmp/shared-process/src/parts/Workers/Workers.json',
  })
  expect(Replace.replace).toHaveBeenCalledWith({
    path: '/tmp/shared-process/src/parts/LinkedWorkerPreferences/LinkedWorkerPreferences.js',
    occurrence: '../../../../renderer-worker/src/parts/Workers/Workers.json',
    replacement: '../Workers/Workers.json',
  })
})
