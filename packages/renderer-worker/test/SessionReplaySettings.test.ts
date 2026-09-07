import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>().mockResolvedValue('session-id')
const get = jest.fn<(key: string) => unknown>()
const getHref = jest.fn<() => Promise<string>>().mockResolvedValue('https://lvce-editor.dev/')
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute: jest.fn() }))
jest.unstable_mockModule('../src/parts/Location/Location.js', () => ({ getHref }))
jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({ get }))
jest.unstable_mockModule('../src/parts/Product/Product.js', () => ({ getBackendUrl: () => 'https://lvce-editor.dev' }))

beforeEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
  get.mockReturnValue(undefined)
})

test.each([undefined, false, 'true', 1])('recording requires explicit opt-in, not %p', async (value) => {
  get.mockReturnValue(value)
  const SessionReplay = await import('../src/parts/SessionReplay/SessionReplay.js')
  await SessionReplay.initialize(undefined)
  expect(invoke).not.toHaveBeenCalled()
  expect(getHref).not.toHaveBeenCalled()
})

test('preference changes start local recording without uploads and stop recording without a reload', async () => {
  const SessionReplay = await import('../src/parts/SessionReplay/SessionReplay.js')
  const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')
  await SessionReplay.initialize(undefined)
  get.mockImplementation((key) => key === 'sessionReplay.enabled')
  await GlobalEventBus.emitEvent('preferences.changed')
  expect(invoke).toHaveBeenLastCalledWith('SessionReplay.configure', {
    local: true,
    upload: false,
    endpoint: 'https://lvce-editor.dev/session-replay',
    token: '',
  })
  await GlobalEventBus.emitEvent('preferences.changed')
  expect(invoke).toHaveBeenCalledTimes(1)
  get.mockReturnValue(false)
  await GlobalEventBus.emitEvent('preferences.changed')
  expect(invoke).toHaveBeenLastCalledWith('SessionReplay.configure', {
    local: false,
    upload: false,
    endpoint: 'https://lvce-editor.dev/session-replay',
    token: '',
  })
})
