import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js', () => {
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
    resizeWebContentsView: jest.fn(() => {
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
})
jest.unstable_mockModule('../src/parts/ElectronWebContentsView/ElectronWebContentsView.js', () => {
  return {
    createWebContentsView: jest.fn(() => {
      return 1
    }),
  }
})

jest.unstable_mockModule('../src/parts/KeyBindingsInitial/KeyBindingsInitial.js', () => {
  return {
    getKeyBindings() {
      return []
    },
  }
})

const ViewletSimpleBrowser = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js')
const ElectronWebContentsViewFunctions = await import('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js')
const ElectronWebContentsView = await import('../src/parts/ElectronWebContentsView/ElectronWebContentsView.js')

test('create', () => {
  const state = ViewletSimpleBrowser.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockImplementation(() => {
    return 1
  })
  // @ts-ignore
  // ElectronWebContentsViewFunctions.resizeBrowserView.mockImplementation(() => {})
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockImplementation(() => {})
  const state = ViewletSimpleBrowser.create(0, 'simple-browser://', 0, 0, 0, 0)
  expect(await ViewletSimpleBrowser.loadContent(state)).toMatchObject({
    iframeSrc: 'https://example.com',
  })
})

test('loadContent - restore id - same browser view', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockImplementation(() => {
    return 1
  })
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockImplementation(() => {})
  const state = ViewletSimpleBrowser.create(0, 'simple-browser://1', 0, 0, 0, 0)
  expect(await ViewletSimpleBrowser.loadContent(state)).toMatchObject({
    iframeSrc: 'https://example.com',
  })
  expect(ElectronWebContentsView.createWebContentsView).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsView.createWebContentsView).toHaveBeenCalledWith(1, 0)
  expect(ElectronWebContentsViewFunctions.setFallthroughKeyBindings).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsViewFunctions.setFallthroughKeyBindings).toHaveBeenCalledWith([])
  expect(ElectronWebContentsViewFunctions.setIframeSrc).not.toHaveBeenCalled()
})

test('loadContent - restore id - browser view does not exist yet', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockImplementation(() => {
    return 2
  })
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockImplementation(() => {})
  const state = ViewletSimpleBrowser.create(0, 'simple-browser://1', 0, 0, 0, 0)
  expect(await ViewletSimpleBrowser.loadContent(state)).toMatchObject({
    iframeSrc: 'https://example.com',
  })
  expect(ElectronWebContentsView.createWebContentsView).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsView.createWebContentsView).toHaveBeenCalledWith(1, 0)
  expect(ElectronWebContentsViewFunctions.setFallthroughKeyBindings).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsViewFunctions.setFallthroughKeyBindings).toHaveBeenCalledWith([])
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(2, 'https://example.com')
})

test('handleTitleUpdated', async () => {
  const state = ViewletSimpleBrowser.create()
  expect(await ViewletSimpleBrowser.handleTitleUpdated(state, 'new Title')).toMatchObject({
    title: '',
  })
})

test('handleWillNavigate', () => {
  const state = ViewletSimpleBrowser.create()
  // @ts-ignore
  expect(ViewletSimpleBrowser.handleWillNavigate(state, 'https://example.com', false, false)).toMatchObject({
    isLoading: true,
  })
})

test('handleDidNavigate', () => {
  const state = { ...ViewletSimpleBrowser.create(), isLoading: true }
  // @ts-ignore
  expect(ViewletSimpleBrowser.handleDidNavigate(state, 'https://example.com', false, false)).toMatchObject({
    isLoading: false,
  })
})
