import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/OpenNativeFolder/OpenNativeFolder.js', () => ({
  openNativeFolder: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => ({
  getDownloadDir: jest.fn(() => '/home/test/Downloads'),
}))

const OpenNativeFolder = await import('../src/parts/OpenNativeFolder/OpenNativeFolder.js')
const ViewletSimpleBrowserOpenDownloads = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserOpenDownloads.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('opens the configured downloads folder', async () => {
  const state = { browserViewId: 12 }

  await expect(ViewletSimpleBrowserOpenDownloads.openDownloads(state)).resolves.toBe(state)
  expect(OpenNativeFolder.openNativeFolder).toHaveBeenCalledWith('/home/test/Downloads')
})
