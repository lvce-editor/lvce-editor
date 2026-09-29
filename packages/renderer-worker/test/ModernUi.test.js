import { beforeEach, expect, jest, test } from '@jest/globals'

const addListener = jest.fn()
const get = jest.fn(() => false)
const invoke = jest.fn()

jest.unstable_mockModule('../src/parts/GlobalEventBus/GlobalEventBus.js', () => ({
  addListener,
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  get,
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke,
}))

const ModernUi = await import('../src/parts/ModernUi/ModernUi.js')

beforeEach(() => {
  jest.clearAllMocks()
  get.mockReturnValue(false)
})

test('hydrate applies the disabled default and subscribes to changes', async () => {
  await ModernUi.hydrate()

  expect(invoke).toHaveBeenCalledWith('Workbench.setModernUi', false)
  expect(addListener).toHaveBeenCalledWith('preferences.changed', expect.any(Function))
})

test('preference changes apply the enabled state', async () => {
  await ModernUi.hydrate()
  get.mockReturnValue(true)

  const listener = /** @type {() => Promise<void>} */ (addListener.mock.calls[0][1])
  await listener()

  expect(invoke).toHaveBeenLastCalledWith('Workbench.setModernUi', true)
})
