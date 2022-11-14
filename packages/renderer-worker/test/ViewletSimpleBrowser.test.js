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
      setIframeSrc: jest.fn(() => {
        throw new Error('not implemented')
      }),
      resizeBrowserView: jest.fn(() => {
        throw new Error('not implemented')
      }),
      setFallthroughKeyBindings: jest.fn(() => {
        throw new Error('not implemented')
      }),
      getStats() {
        return {
          title: 'test',
          url: '',
          canGoBack: true,
          canGoForward: true,
        }
      },
    }
  }
)
jest.unstable_mockModule(
  '../src/parts/ElectronBrowserView/ElectronBrowserView.js',
  () => {
    return {
      createBrowserView: jest.fn(() => {
        return 1
      }),
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
const ElectronBrowserView = await import(
  '../src/parts/ElectronBrowserView/ElectronBrowserView.js'
)

test('create', () => {
  const state = ViewletSimpleBrowser.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  // @ts-ignore
  ElectronBrowserView.createBrowserView.mockImplementation(() => {
    return 1
  })
  // @ts-ignore
  ElectronBrowserViewFunctions.resizeBrowserView.mockImplementation(() => {})
  // @ts-ignore
  ElectronBrowserViewFunctions.setIframeSrc.mockImplementation(() => {})
  const state = ViewletSimpleBrowser.create(0, 'simple-browser://', 0, 0, 0, 0)
  expect(await ViewletSimpleBrowser.loadContent(state)).toMatchObject({
    iframeSrc: 'https://example.com',
  })
})

test('loadContent - restore id - same browser view', async () => {
  // @ts-ignore
  ElectronBrowserView.createBrowserView.mockImplementation(() => {
    return 1
  })
  // @ts-ignore
  ElectronBrowserViewFunctions.setIframeSrc.mockImplementation(() => {})
  const state = ViewletSimpleBrowser.create(0, 'simple-browser://1', 0, 0, 0, 0)
  expect(await ViewletSimpleBrowser.loadContent(state)).toMatchObject({
    iframeSrc: 'https://example.com',
  })
  expect(ElectronBrowserView.createBrowserView).toHaveBeenCalledTimes(1)
  expect(ElectronBrowserView.createBrowserView).toHaveBeenCalledWith(1)
  expect(
    ElectronBrowserViewFunctions.setFallthroughKeyBindings
  ).toHaveBeenCalledTimes(1)
  expect(
    ElectronBrowserViewFunctions.setFallthroughKeyBindings
  ).toHaveBeenCalledWith([])
  expect(ElectronBrowserViewFunctions.setIframeSrc).not.toHaveBeenCalled()
})

test('loadContent - restore id - browser view does not exist yet', async () => {
  // @ts-ignore
  ElectronBrowserView.createBrowserView.mockImplementation(() => {
    return 2
  })
  // @ts-ignore
  ElectronBrowserViewFunctions.setIframeSrc.mockImplementation(() => {})
  const state = ViewletSimpleBrowser.create(0, 'simple-browser://1', 0, 0, 0, 0)
  expect(await ViewletSimpleBrowser.loadContent(state)).toMatchObject({
    iframeSrc: 'https://example.com',
  })
  expect(ElectronBrowserView.createBrowserView).toHaveBeenCalledTimes(1)
  expect(ElectronBrowserView.createBrowserView).toHaveBeenCalledWith(1)
  expect(
    ElectronBrowserViewFunctions.setFallthroughKeyBindings
  ).toHaveBeenCalledTimes(1)
  expect(
    ElectronBrowserViewFunctions.setFallthroughKeyBindings
  ).toHaveBeenCalledWith([])
  expect(ElectronBrowserViewFunctions.setIframeSrc).toHaveBeenCalledTimes(1)
  expect(ElectronBrowserViewFunctions.setIframeSrc).toHaveBeenCalledWith(
    2,
    'https://example.com'
  )
})

test('handleTitleUpdated', () => {
  const state = ViewletSimpleBrowser.create()
  expect(
    ViewletSimpleBrowser.handleTitleUpdated(state, 'new Title')
  ).toMatchObject({
    title: 'new Title',
  })
})

test('handleWillNavigate', () => {
  const state = ViewletSimpleBrowser.create()
  expect(
    ViewletSimpleBrowser.handleWillNavigate(
      state,
      'https://example.com',
      false,
      false
    )
  ).toMatchObject({
    isLoading: true,
  })
})

test('handleDidNavigate', () => {
  const state = { ...ViewletSimpleBrowser.create(), isLoading: true }
  expect(
    ViewletSimpleBrowser.handleDidNavigate(
      state,
      'https://example.com',
      false,
      false
    )
  ).toMatchObject({
    isLoading: false,
  })
})
