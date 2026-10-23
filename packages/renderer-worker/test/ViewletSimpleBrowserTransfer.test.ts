import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js', () => ({
  resizeWebContentsView: jest.fn(),
  show: jest.fn(),
  focus: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/ElectronWebContentsView/ElectronWebContentsView.js', () => ({
  createWebContentsView: jest.fn(),
  disposeWebContentsView: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke: jest.fn() }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({
  setStateFunctional: jest.fn(() => []),
}))
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({ getInstance: jest.fn(), setRenderedState: jest.fn() }))
const Browser = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js')
const Native = await import('../src/parts/ElectronWebContentsView/ElectronWebContentsView.js')
const Bounds = await import('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const States = await import('../src/parts/ViewletStates/ViewletStates.js')

test('transfer retains live native view and metadata with exactly one owning pane', async () => {
  const moved = { browserViewId: 10, title: 'Draft', inputValue: 'http://localhost/draft', iframeSrc: 'http://localhost/draft', muted: true }
  const retained = { browserViewId: 11, title: 'Video' }
  const source = {
    ...Browser.create(1, 'simple-browser://', 600, 0, 600, 800),
    tabs: [moved, retained],
    browserViewId: 10,
    draggedTab: moved,
    isDraggingTab: true,
  }
  const target = { state: Browser.create(2, 'simple-browser://', 0, 400, 600, 400) }
  jest.mocked(States.getInstance).mockReturnValue(target)
  const result = await Browser.moveTabToBrowser(source, 10, 2)
  expect(result.tabs).toEqual([retained])
  expect(result.browserViewId).toBe(11)
  expect(result.isDraggingTab).toBe(false)
  const adopted = jest.mocked(Viewlet.setStateFunctional).mock.calls.find(([uid]) => uid === 2)?.[1]
  expect(adopted.tabs[0]).toBe(moved)
  expect(adopted.browserViewId).toBe(10)
  expect(adopted.muted).toBe(true)
  expect(Bounds.resizeWebContentsView).toHaveBeenCalledWith(10, 0, 465, 600, 335)
  expect(Native.createWebContentsView).not.toHaveBeenCalled()
  expect(Native.disposeWebContentsView).not.toHaveBeenCalled()
})

test('transfer appends to a populated destination and selects the moved tab', async () => {
  const moved = { browserViewId: 10, title: 'Draft', inputValue: 'http://localhost/draft' }
  const source = {
    ...Browser.create(1, 'simple-browser://', 600, 0, 600, 800),
    tabs: [moved],
    browserViewId: 10,
    draggedTab: moved,
    isDraggingTab: true,
  }
  const existingTab = { browserViewId: 20, title: 'Existing' }
  const target = {
    state: {
      ...Browser.create(2, 'simple-browser://', 600, 0, 600, 800),
      tabs: [existingTab],
      browserViewId: 20,
    },
  }
  jest.mocked(States.getInstance).mockReturnValue(target)
  await Browser.moveTabToBrowser(source, 10, 2)
  const adopted = jest.mocked(Viewlet.setStateFunctional).mock.calls.at(-1)?.[1]
  expect(adopted.tabs).toMatchObject([existingTab, moved])
  expect(adopted.selectedTabIndex).toBe(1)
  expect(adopted.browserViewId).toBe(10)
  expect(adopted.inputValue).toBe('http://localhost/draft')
})

test('moving the final source tab keeps an empty source tab available', async () => {
  const moved = { browserViewId: 10, title: 'Draft' }
  const source = {
    ...Browser.create(1, 'simple-browser://', 600, 0, 600, 800),
    tabs: [moved],
    browserViewId: 10,
    draggedTab: moved,
    isDraggingTab: true,
  }
  const target = { state: Browser.create(2, 'simple-browser://', 600, 0, 600, 800) }
  jest.mocked(States.getInstance).mockReturnValue(target)
  const result = await Browser.moveTabToBrowser(source, 10, 2)
  expect(result.tabs).toHaveLength(1)
  expect(result.tabs[0]).not.toBe(moved)
  expect(result.tabs[0].browserViewId).toBe(0)
  expect(result.isDraggingTab).toBe(false)
})
