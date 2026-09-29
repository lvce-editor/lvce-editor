import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js', () => ({
  toggleDevTools: jest.fn(),
}))

const ElectronWebContentsViewFunctions = await import('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js')
const ViewletSimpleBrowserToggleDevTools = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserToggleDevTools.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('toggles developer tools for the active browser tab', async () => {
  const state = { browserViewId: 12 }

  await expect(ViewletSimpleBrowserToggleDevTools.toggleDevTools(state)).resolves.toBe(state)
  expect(ElectronWebContentsViewFunctions.toggleDevTools).toHaveBeenCalledWith(12)
})
