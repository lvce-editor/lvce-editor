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
  getHref.mockResolvedValue('https://lvce-editor.dev/')
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
  expect(invoke).toHaveBeenCalledWith('SessionReplay.configure', {
    local: false,
    upload: true,
    endpoint: `https://backend.example/session-replay${value === true ? '?allowAnonymous=true' : ''}`,
    token: 'test-token',
  })
})

test('anonymous upload permission can be toggled without reloading', async () => {
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
      upload: true,
      endpoint: `https://lvce-editor.dev/session-replay${enabled ? '?allowAnonymous=true' : ''}`,
      token: '',
    })
  }
  expect(invoke).toHaveBeenCalledTimes(3)
  await GlobalEventBus.emitEvent('preferences.changed')
  expect(invoke).toHaveBeenCalledTimes(3)
})

test.each(['true', 'false', '1'])('the anonymous upload URL opt-in remains supported: %s', async (value) => {
  get.mockImplementation((key) => key === 'sessionReplay.uploadEnabled')
  getHref.mockResolvedValue(`https://lvce-editor.dev/?allowAnonymous=${value}`)
  const SessionReplay = await import('../src/parts/SessionReplay/SessionReplay.js')
  await SessionReplay.initialize(undefined)
  expect(invoke).toHaveBeenCalledWith('SessionReplay.configure', {
    local: false,
    upload: true,
    endpoint: `https://lvce-editor.dev/session-replay${value === 'true' ? '?allowAnonymous=true' : ''}`,
    token: '',
  })
})
