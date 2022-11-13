import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js',
  () => {
    return {
      forward: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ViewletSimpleBrowser = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js'
)
const ViewletSimpleBrowserForward = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserForward.js'
)
const ElectronBrowserViewFunctions = await import(
  '../src/parts/ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'
)

test('forward', async () => {
  // @ts-ignore
  ElectronBrowserViewFunctions.forward.mockImplementation(() => {})
  const state = ViewletSimpleBrowser.create()
  await ViewletSimpleBrowserForward.forward(state)
  expect(ElectronBrowserViewFunctions.forward).toHaveBeenCalledTimes(1)
  expect(ElectronBrowserViewFunctions.forward).toHaveBeenCalledWith(0)
})
