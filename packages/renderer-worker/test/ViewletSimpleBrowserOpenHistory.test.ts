import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ElectronWebContentsView/ElectronWebContentsView.js', () => ({
  createWebContentsView: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js', () => ({
  hide: jest.fn(),
  show: jest.fn(),
  focus: jest.fn(),
  resizeWebContentsView: jest.fn(),
  setIframeSrc: jest.fn(),
}))

const ViewletSimpleBrowserOpenHistory = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserOpenHistory.js')
const ViewletSimpleBrowser = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('opens history in a new browser tab', async () => {
  const state = {
    ...ViewletSimpleBrowser.create(12, 'simple-browser://'),
    tabs: [
      {
        browserViewId: 13,
        iframeSrc: 'https://example.com',
        inputValue: 'https://example.com',
        title: 'Example',
      },
    ],
    browserViewId: 13,
  }

  const newState = await ViewletSimpleBrowserOpenHistory.openHistory(state)

  expect(newState.selectedTabIndex).toBe(1)
  expect(newState.tabs[1]).toMatchObject({
    browserViewId: 0,
    iframeSrc: 'simple-browser-history://',
    inputValue: 'simple-browser-history://',
    title: 'History',
  })
})
