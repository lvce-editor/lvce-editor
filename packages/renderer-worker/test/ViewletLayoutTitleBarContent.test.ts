import { beforeEach, expect, jest, test } from '@jest/globals'

const afterRender = jest.fn<(...args: unknown[]) => Promise<void>>()
const executeViewletCommand = jest.fn<(...args: unknown[]) => Promise<void>>()
const invoke = jest.fn<(...args: unknown[]) => Promise<unknown>>()
const getInstance = jest.fn()

jest.unstable_mockModule('../src/parts/BrowserFullWidth/BrowserFullWidth.js', () => ({ afterRender }))
jest.unstable_mockModule('../src/parts/TitleBarWorker/TitleBarWorker.js', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ executeViewletCommand }))
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({ getInstance }))

const Layout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

beforeEach(() => {
  jest.clearAllMocks()
  getInstance.mockReturnValue({ state: { uid: 42 } })
  invoke.mockResolvedValue({ showSideBarThings: true })
})

const state = () => ({ ...Layout.create(1), applicationId: 'app' })
const fullWidthState = () => ({
  browserUid: 3,
  hideTitleBar: true,
  layout: {},
  browserBounds: { x: 0, y: 0, width: 800, height: 600 },
  ideFocusUid: undefined,
  addressFocused: false,
  hiddenBrowserUids: [],
})

test('full width hides title bar content and restoring normal layout shows it', async () => {
  const normal = state()
  const fullWidth = {
    ...normal,
    browserFullWidth: fullWidthState(),
  }

  await Layout.afterRender(normal, fullWidth)

  expect(invoke).toHaveBeenCalledWith('TitleBar.getComponentState', 42)
  expect(executeViewletCommand).toHaveBeenCalledWith(42, 'setShowSideBarThings', false)

  invoke.mockResolvedValue({ showSideBarThings: false })
  await Layout.afterRender(fullWidth, normal)

  expect(executeViewletCommand).toHaveBeenLastCalledWith(42, 'setShowSideBarThings', true)
})

test('titlebarless mode hides title bar content', async () => {
  const normal = state()
  const titleBarless = { ...normal, titleBarless: true }

  await Layout.afterRender(normal, titleBarless)

  expect(executeViewletCommand).toHaveBeenCalledWith(42, 'setShowSideBarThings', false)
})

test('combined hidden modes do not send a redundant title bar update', async () => {
  const fullWidth = { ...state(), browserFullWidth: fullWidthState() }
  const titleBarlessFullWidth = { ...fullWidth, titleBarless: true }

  await Layout.afterRender(fullWidth, titleBarlessFullWidth)

  expect(invoke).not.toHaveBeenCalled()
  expect(executeViewletCommand).not.toHaveBeenCalled()
})
