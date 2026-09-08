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
  getHref.mockResolvedValue('https://lvce-editor.dev/')
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

test('allowing anonymous uploads alone does not start recording or uploads', async () => {
  get.mockImplementation((key) => key === 'sessionReplay.allowAnonymousUploads')
  const SessionReplay = await import('../src/parts/SessionReplay/SessionReplay.js')
  await SessionReplay.initialize(undefined)
  expect(invoke).not.toHaveBeenCalled()
})

test.each([undefined, false, 'true', 1, true])('anonymous upload permission requires a boolean true setting: %p', async (value) => {
  get.mockImplementation((key) => {
    if (key === 'sessionReplay.uploadEnabled') return true
    if (key === 'sessionReplay.allowAnonymousUploads') return value
    if (key === 'layout.backendUrl') return 'https://backend.example/editor'
    return undefined
  })
  const SessionReplay = await import('../src/parts/SessionReplay/SessionReplay.js')
  await SessionReplay.initialize({ token: 'test-token' })
  expect(configureSessionReplay).toHaveBeenCalledWith({
    local: false,
    upload: true,
    endpoint: `https://backend.example/session-replay${value === true ? '?allowAnonymous=true' : ''}`,
    token: 'test-token',
  })
})

test('changing anonymous upload permission stops capture and requests a reload', async () => {
  let allowAnonymousUploads = false
  get.mockImplementation((key) => {
    if (key === 'sessionReplay.uploadEnabled') return true
    if (key === 'sessionReplay.allowAnonymousUploads') return allowAnonymousUploads
    return undefined
  })
  const SessionReplay = await import('../src/parts/SessionReplay/SessionReplay.js')
  const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')
  await SessionReplay.initialize(undefined)
  for (const enabled of [true, false]) {
    allowAnonymousUploads = enabled
    await GlobalEventBus.emitEvent('preferences.changed')
    expect(invoke).toHaveBeenLastCalledWith('SessionReplay.configure', {
      local: false,
      upload: false,
      endpoint: `https://lvce-editor.dev/session-replay${enabled ? '?allowAnonymous=true' : ''}`,
      token: '',
    })
  }
  expect(configureSessionReplay).toHaveBeenCalledTimes(1)
  expect(execute).toHaveBeenCalledTimes(2)
  expect(invoke).toHaveBeenCalledTimes(2)
  await GlobalEventBus.emitEvent('preferences.changed')
  expect(invoke).toHaveBeenCalledTimes(2)
})

test.each(['true', 'false', '1'])('the anonymous upload URL opt-in remains supported: %s', async (value) => {
  get.mockImplementation((key) => key === 'sessionReplay.uploadEnabled')
  getHref.mockResolvedValue(`https://lvce-editor.dev/?allowAnonymous=${value}`)
  const SessionReplay = await import('../src/parts/SessionReplay/SessionReplay.js')
  await SessionReplay.initialize(undefined)
  expect(configureSessionReplay).toHaveBeenCalledWith({
    local: false,
    upload: true,
    endpoint: `https://lvce-editor.dev/session-replay${value === 'true' ? '?allowAnonymous=true' : ''}`,
    token: '',
  })
})
