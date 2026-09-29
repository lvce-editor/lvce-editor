import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ContextMenu/ContextMenu.js', () => ({
  show2Below: jest.fn(),
}))

const ContextMenu = await import('../src/parts/ContextMenu/ContextMenu.js')
const MenuEntryId = await import('../src/parts/MenuEntryId/MenuEntryId.js')
const ViewletSimpleBrowserShowDownloadsMenu = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserShowDownloadsMenu.js')

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(ContextMenu.show2Below).mockResolvedValue(undefined)
})

test('opens the downloads menu below the toolbar button', async () => {
  const state = { uid: 42, browserViewId: 17, y: 10 }
  await expect(ViewletSimpleBrowserShowDownloadsMenu.showDownloadsMenu(state, 700, 100, 20, 30)).resolves.toBe(state)
  expect(ContextMenu.show2Below).toHaveBeenCalledWith(42, MenuEntryId.SimpleBrowserDownloads, 700, 160, 17)
})
