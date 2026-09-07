import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>().mockResolvedValue('session-id')
const configureSessionReplay = jest.fn<(...args: readonly unknown[]) => Promise<string>>().mockResolvedValue('session-id')
const execute = jest.fn<any>()
const get = jest.fn<(key: string) => unknown>()
const getHref = jest.fn<() => Promise<string>>().mockResolvedValue('https://lvce-editor.dev/')
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ configureSessionReplay, invoke }))
jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute }))
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
  expect(configureSessionReplay).not.toHaveBeenCalled()
  expect(getHref).not.toHaveBeenCalled()
})

test('late opt-in requests a reload without preventing other preference listeners', async () => {
  const SessionReplay = await import('../src/parts/SessionReplay/SessionReplay.js')
  const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')
  await SessionReplay.initialize(undefined)
  const listener = jest.fn<any>()
  GlobalEventBus.addListener('preferences.changed', listener)
  get.mockImplementation((key) => key === 'sessionReplay.enabled')
  await GlobalEventBus.emitEvent('preferences.changed')
  expect(configureSessionReplay).not.toHaveBeenCalled()
  expect(execute).toHaveBeenCalledWith('Notification.create', 'info', expect.stringContaining('Reload the window'))
  expect(listener).toHaveBeenCalledTimes(1)
  await GlobalEventBus.emitEvent('preferences.changed')
  expect(execute).toHaveBeenCalledTimes(1)
  get.mockReturnValue(false)
  await GlobalEventBus.emitEvent('preferences.changed')
  expect(invoke).toHaveBeenLastCalledWith('SessionReplay.configure', {
    endpoint: 'https://lvce-editor.dev/session-replay',
    local: false,
    token: '',
    upload: false,
  })
})

test('startup opt-in uses the proxy and disabling capture takes effect immediately', async () => {
  get.mockImplementation((key) => key === 'sessionReplay.enabled')
  const SessionReplay = await import('../src/parts/SessionReplay/SessionReplay.js')
  const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')
  const GetSessionId = await import('../src/parts/GetSessionId/GetSessionId.js')
  await SessionReplay.initialize(undefined)
  expect(configureSessionReplay).toHaveBeenCalledWith({
    endpoint: 'https://lvce-editor.dev/session-replay',
    local: true,
    token: '',
    upload: false,
  })
  expect(GetSessionId.state.sessionId).toBe('session-id')
  get.mockReturnValue(false)
  await GlobalEventBus.emitEvent('preferences.changed')
  expect(invoke).toHaveBeenCalledWith('SessionReplay.configure', {
    endpoint: 'https://lvce-editor.dev/session-replay',
    local: false,
    token: '',
    upload: false,
  })
  expect(GetSessionId.state.sessionId).toBe('')
  expect(execute).not.toHaveBeenCalled()
})
