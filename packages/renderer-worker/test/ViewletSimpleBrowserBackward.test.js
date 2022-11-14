import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js',
  () => {
    return {
      backward: jest.fn(() => {
        throw new Error('not implemented')
      }),
      getStats() {
        return {
          title: '',
          url: '',
          canGoBack: true,
          canGoForward: true,
        }
      },
    }
  }
)

const ViewletSimpleBrowser = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js'
)
const ViewletSimpleBrowserBackward = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserBackward.js'
)
const ElectronBrowserViewFunctions = await import(
  '../src/parts/ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'
)

// TODO iframe url should be changed

test('backward', async () => {
  // @ts-ignore
  ElectronBrowserViewFunctions.backward.mockImplementation(() => {})
  const state = ViewletSimpleBrowser.create()
  await ViewletSimpleBrowserBackward.backward(state)
  expect(ElectronBrowserViewFunctions.backward).toHaveBeenCalledTimes(1)
  expect(ElectronBrowserViewFunctions.backward).toHaveBeenCalledWith(0)
})
