import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js',
  () => {
    return {
      reload: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ViewletSimpleBrowser = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js'
)
const ViewletSimpleBrowserReload = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserReload.js'
)
const ElectronBrowserViewFunctions = await import(
  '../src/parts/ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'
)

test('reload', async () => {
  // @ts-ignore
  ElectronBrowserViewFunctions.reload.mockImplementation(() => {})
  const state = ViewletSimpleBrowser.create()
  await ViewletSimpleBrowserReload.reload(state)
  expect(ElectronBrowserViewFunctions.reload).toHaveBeenCalledTimes(1)
  expect(ElectronBrowserViewFunctions.reload).toHaveBeenCalledWith(0)
})
