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
      toggleDevtools: jest.fn(() => {
        throw new Error('not implemented')
      }),
      forward: jest.fn(() => {
        throw new Error('not implemented')
      }),
      backward: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule(
  '../src/parts/ElectronBrowserView/ElectronBrowserView.js',
  () => {
    return {
      createBrowserView: jest.fn(),
    }
  }
)

jest.unstable_mockModule('../src/parts/KeyBindings/KeyBindings.js', () => {
  return {
    getKeyBindings() {
      return []
    },
  }
})

const ViewletSimpleBrowser = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js'
)
const ElectronBrowserViewFunctions = await import(
  '../src/parts/ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'
)

test('name', () => {
  expect(ViewletSimpleBrowser.name).toBe('SimpleBrowser')
})

test('create', () => {
  const state = ViewletSimpleBrowser.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletSimpleBrowser.create()
  expect(await ViewletSimpleBrowser.loadContent(state)).toMatchObject({
    iframeSrc: 'https://example.com',
  })
})

// TODO handle error
test('forward', async () => {
  // @ts-ignore
  ElectronBrowserViewFunctions.forward.mockImplementation(() => {})
  // TODO iframe url should be changed
  const state = ViewletSimpleBrowser.create()
  await ViewletSimpleBrowser.forward(state)
  expect(ElectronBrowserViewFunctions.forward).toHaveBeenCalledTimes(1)
})

test('backward', async () => {
  // @ts-ignore
  ElectronBrowserViewFunctions.backward.mockImplementation(() => {})
  // TODO iframe url should be changed
  const state = ViewletSimpleBrowser.create()
  await ViewletSimpleBrowser.backward(state)
  expect(ElectronBrowserViewFunctions.backward).toHaveBeenCalledTimes(1)
})

test('reload', async () => {
  // @ts-ignore
  ElectronBrowserViewFunctions.reload.mockImplementation(() => {})
  const state = ViewletSimpleBrowser.create()
  await ViewletSimpleBrowser.reload(state)
  expect(ElectronBrowserViewFunctions.reload).toHaveBeenCalledTimes(1)
})
